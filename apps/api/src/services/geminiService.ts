import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AttackTreeNode, ThinkingStep, Exploit, CodeSnippet, GitRepoInfo } from '../types/index.js';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private thinkingModel: any;
  private modelNames = [
    'gemini-3-pro-preview',      // Primary: More stable Gemini 3 Pro
    'gemini-3-flash-preview',    // Fallback 1: Gemini 3 Flash
    'gemini-2.5-flash',          // Fallback 2: Stable Gemini 2.5
    'gemini-2.0-flash-001'       // Fallback 3: Stable Gemini 2.0
  ];
  private currentModelIndex = 0;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.initializeModels();
  }

  private initializeModels() {
    const modelName = this.modelNames[this.currentModelIndex];
    console.log(`🚀 Initializing with model: ${modelName}`);
    this.model = this.genAI.getGenerativeModel({ model: modelName });
    this.thinkingModel = this.genAI.getGenerativeModel({ model: modelName });
  }

  private async retryWithFallback<T>(operation: () => Promise<T>, operationName: string): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt < this.modelNames.length; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        console.error(`❌ ${operationName} failed with ${this.modelNames[this.currentModelIndex]}:`, error.message);
        
        // Check if it's a 503 or rate limit error
        if (error.status === 503 || error.status === 429) {
          // Try next model
          this.currentModelIndex++;
          if (this.currentModelIndex < this.modelNames.length) {
            console.log(`🔄 Retrying with fallback model: ${this.modelNames[this.currentModelIndex]}`);
            this.initializeModels();
            continue;
          }
        }
        
        // For other errors or if we've exhausted all models, throw
        throw error;
      }
    }
    
    throw lastError;
  }

  async generateAttackTree(
    target: string, 
    image?: { buffer: Buffer; mimetype: string; originalname: string },
    onNodeUpdate?: (node: AttackTreeNode) => void,
    gitInfo?: GitRepoInfo
  ): Promise<AttackTreeNode[]> {
    const gitContext = gitInfo ? `
REPOSITORY ANALYSIS:
- Repository: ${gitInfo.url}
- Technologies Detected: ${gitInfo.technologies.join(', ')}
- Total Files: ${gitInfo.files.length}
- Package Files: ${gitInfo.packageFiles.join(', ')}
- Configuration Files: ${gitInfo.configFiles.join(', ')}
- Potential Secrets: ${gitInfo.secretsFound ? 'YES ⚠️' : 'NO'}

KEY FILES TO ANALYZE:
${gitInfo.files.slice(0, 20).join('\n')}\n` : '';

    const prompt = `You are an elite offensive security researcher and penetration tester analyzing: ${target}

${image ? '📸 VISUAL CONTEXT: A screenshot/image has been provided for additional reconnaissance.\n' : ''}
${gitContext}

MISSION: Conduct a comprehensive security assessment and generate a detailed attack tree.

For EACH vulnerability/attack vector you identify, provide:
1. ✓ Clear, actionable name
2. ✓ Detailed technical description with attack methodology
3. ✓ Severity: critical/high/medium/low
4. ✓ Specific file paths affected (if analyzing code)
5. ✓ Code snippets showing vulnerable sections (with line numbers)
6. ✓ CVE IDs if applicable
7. ✓ Concrete remediation steps
8. ✓ Child nodes for multi-stage attacks

FOCUS AREAS:
- Authentication & Authorization flaws
- Injection vulnerabilities (SQL, XSS, Command, etc.)
- Security misconfigurations
- Sensitive data exposure
- API security issues
- Dependencies with known vulnerabilities
- Secrets/credentials in code
- CORS & CSRF vulnerabilities
- Business logic flaws

Output as JSON array following this EXACT structure:
[{
  "id": "unique_id",
  "name": "Attack Vector Name",
  "description": "Detailed technical description of the vulnerability and exploitation method",
  "severity": "critical|high|medium|low",
  "affectedFiles": ["path/to/file.js", "path/to/another.py"],
  "codeSnippets": [{
    "file": "path/to/vulnerable.js",
    "lineStart": 45,
    "lineEnd": 52,
    "code": "actual code snippet here",
    "issue": "explanation of what's wrong"
  }],
  "cve": "CVE-2024-XXXX",
  "remediation": "Step-by-step fix instructions",
  "children": []
}]

Be thorough, technical, and prioritize HIGH-IMPACT vulnerabilities.`;

    return this.retryWithFallback(async () => {
      let parts: any[] = [{ text: prompt }];
      
      if (image) {
        parts.push({
          inlineData: {
            data: image.buffer.toString('base64'),
            mimeType: image.mimetype
          }
        });
      }

      const result = await this.model.generateContent(parts);
      const response = result.response.text();
      
      // Extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Failed to parse attack tree from response');
      }

      const nodes: AttackTreeNode[] = JSON.parse(jsonMatch[0]);
      
      // Emit nodes progressively
      if (onNodeUpdate) {
        for (const node of nodes) {
          onNodeUpdate(node);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      return nodes;
    }, 'generateAttackTree').catch(error => {
      console.error('Error generating attack tree:', error);
      return [{
        id: 'error',
        name: 'Analysis Error',
        description: 'Failed to generate attack tree. Please check your input and try again.',
        severity: 'low'
      }];
    });
  }

  async analyzeWithThinking(
    target: string,
    image: any,
    attackTree: AttackTreeNode[],
    onThinkingStep?: (step: ThinkingStep) => void
  ): Promise<ThinkingStep[]> {
    const criticalCount = attackTree.filter(n => n.severity === 'critical').length;
    const highCount = attackTree.filter(n => n.severity === 'high').length;
    
    const prompt = `As an expert penetration tester, perform deep analysis on: ${target}

DISCOVERED VULNERABILITIES:
${JSON.stringify(attackTree.map(n => ({
  name: n.name,
  severity: n.severity,
  description: n.description,
  files: n.affectedFiles,
  cve: n.cve
})), null, 2)}

SEVERITY BREAKDOWN:
🔴 Critical: ${criticalCount}
🟠 High: ${highCount}
🟡 Medium: ${attackTree.filter(n => n.severity === 'medium').length}
🔵 Low: ${attackTree.filter(n => n.severity === 'low').length}

DEEP ANALYSIS REQUIREMENTS:
1. Rank vulnerabilities by CVSS score and exploitability
2. Identify attack chains (combining multiple vulns)
3. Assess real-world impact and likelihood
4. Determine if exploits are publicly available
5. Evaluate defense mechanisms in place
6. Recommend prioritized remediation roadmap
7. Identify quick wins vs. long-term fixes
8. Consider business context and risk

Think step-by-step and provide tactical security insights.
Format your response with clear sections using ##.`;

    return this.retryWithFallback(async () => {
      const result = await this.thinkingModel.generateContent(prompt);
      const response = result.response.text();
      
      const steps: ThinkingStep[] = [];
      const sections = response.split('##').filter((t: string) => t.trim());
      
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i].trim();
        const lines = section.split('\n');
        const title = lines[0].trim();
        const content = lines.slice(1).join('\n').trim();
        
        const step: ThinkingStep = {
          id: `thinking_${i}`,
          step: i + 1,
          thought: title,
          reasoning: content || title,
          timestamp: Date.now()
        };
        
        steps.push(step);
        
        if (onThinkingStep) {
          onThinkingStep(step);
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      return steps;
    }, 'analyzeWithThinking').catch(error => {
      console.error('Error in thinking mode:', error);
      return [];
    });
  }

  async generateExploits(
    target: string,
    attackTree: AttackTreeNode[],
    thinkingSteps: ThinkingStep[],
    onExploitGenerated?: (exploit: Exploit) => void
  ): Promise<Exploit[]> {
    const highSeverityNodes = attackTree.filter(n => 
      n.severity === 'critical' || n.severity === 'high'
    );

    if (highSeverityNodes.length === 0) {
      return [];
    }

    const prompt = `You are a security researcher creating proof-of-concept exploits.

TARGET: ${target}

CRITICAL/HIGH VULNERABILITIES IDENTIFIED:
${highSeverityNodes.map(n => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ${n.name} [${n.severity.toUpperCase()}]
📝 ${n.description}
${n.affectedFiles ? `📁 Files: ${n.affectedFiles.join(', ')}` : ''}
${n.cve ? `🔖 CVE: ${n.cve}` : ''}
${n.codeSnippets ? `\n💻 Vulnerable Code:\n${n.codeSnippets.map(cs => `${cs.file}:${cs.lineStart}-${cs.lineEnd}\n${cs.code}\nIssue: ${cs.issue}`).join('\n')}` : ''}
`).join('\n')}

EXPLOIT GENERATION REQUIREMENTS:
1. Create WORKING, production-ready exploit scripts
2. Include error handling and edge cases
3. Add detailed comments explaining each step
4. Use modern libraries and best practices
5. Target the SPECIFIC vulnerabilities found
6. Make scripts modular and reusable

For each exploit, provide:
- Professional naming
- Clear description of what it does
- Complete, executable script code
- Language (python/bash preferred)
- Severity matching the vulnerability
- Category (Web/API/Network/Auth/etc)
- Usage instructions in comments

Output as JSON array:
[{
  "name": "Descriptive Exploit Name",
  "description": "What this exploit does and why it works",
  "script": "#!/usr/bin/env python3\\n# Complete working code here...",
  "language": "python",
  "severity": "high",
  "category": "Web Security"
}]

Generate 3-5 HIGH-QUALITY exploits. Quality over quantity!`;

    return this.retryWithFallback(async () => {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return [];
      }

      const exploitsData = JSON.parse(jsonMatch[0]);
      const exploits: Exploit[] = exploitsData.map((e: any, i: number) => ({
        id: `exploit_${i}`,
        ...e
      }));

      if (onExploitGenerated) {
        for (const exploit of exploits) {
          onExploitGenerated(exploit);
          await new Promise(resolve => setTimeout(resolve, 400));
        }
      }

      return exploits;
    }, 'generateExploits').catch(error => {
      console.error('Error generating exploits:', error);
      return [];
    });
  }

  async generateCodeFixes(
    attackTree: AttackTreeNode[],
    gitInfo?: GitRepoInfo
  ): Promise<CodeSnippet[]> {
    const vulnerableNodes = attackTree.filter(n => 
      n.codeSnippets && n.codeSnippets.length > 0
    );

    if (vulnerableNodes.length === 0) {
      return [];
    }

    const prompt = `You are a senior software engineer and security expert. Generate secure code fixes for the following vulnerabilities:

VULNERABILITIES TO FIX:
${vulnerableNodes.map(node => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 ${node.name} [${node.severity.toUpperCase()}]
📝 ${node.description}

VULNERABLE CODE:
${node.codeSnippets?.map(cs => `
File: ${cs.file}
Lines: ${cs.lineStart}-${cs.lineEnd}
\`\`\`
${cs.code}
\`\`\`
Issue: ${cs.issue}
`).join('\n')}

REMEDIATION NEEDED: ${node.remediation}
`).join('\n')}

For each vulnerability, provide:
1. The FIXED version of the code
2. Explanation of what was changed and why
3. Any additional security best practices

Output as JSON array:
[{
  "file": "path/to/file",
  "lineStart": 10,
  "lineEnd": 20,
  "code": "// Fixed secure code here",
  "issue": "Original issue description",
  "fix": "Detailed explanation of the fix and security improvements made"
}]`;

    return this.retryWithFallback(async () => {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return [];
      }

      const fixes: CodeSnippet[] = JSON.parse(jsonMatch[0]);
      return fixes;
    }, 'generateCodeFixes').catch(error => {
      console.error('Error generating code fixes:', error);
      return [];
    });
  }
}
