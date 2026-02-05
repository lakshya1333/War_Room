import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AttackTreeNode, ThinkingStep, Exploit, CodeSnippet, GitRepoInfo } from '../types/index.js';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private thinkingModel: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    // Using Gemini Flash Lite - Higher free tier quota (1500 RPD)
    // Good balance between performance and quota limits
    const modelName = 'gemini-flash-lite-latest';
    console.log(`🤖 Initializing Gemini model: ${modelName}`);
    this.model = this.genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });
    this.thinkingModel = this.genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });
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

Output as a VALID JSON array. NO markdown, NO code blocks, NO trailing commas, NO comments.
Return ONLY the JSON array following this EXACT structure:
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

CRITICAL: Return ONLY valid JSON. No text before or after the array. No trailing commas.
Be thorough, technical, and prioritize HIGH-IMPACT vulnerabilities.`;

    try {
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
      
      console.log('🤖 Gemini response length:', response.length);
      console.log('🤖 Response preview:', response.substring(0, 300));
      
      // Extract JSON from response (handle markdown code blocks)
      let jsonString = response;
      
      // Remove markdown code blocks if present - use greedy matching to get everything
      if (response.includes('```')) {
        // Match from first ``` to last ```
        const firstBlock = response.indexOf('```');
        const lastBlock = response.lastIndexOf('```');
        if (firstBlock !== -1 && lastBlock > firstBlock) {
          jsonString = response.substring(firstBlock, lastBlock);
          // Remove the opening ```json or ``` line
          jsonString = jsonString.replace(/^```(?:json)?\s*/, '');
        }
      }
      
      // Find the JSON array using proper bracket counting
      const firstBracket = jsonString.indexOf('[');
      if (firstBracket === -1) {
        console.error('❌ No opening bracket found in response');
        console.error('Response preview:', response.substring(0, 1000));
        throw new Error('Failed to parse attack tree from response');
      }

      // Count brackets to find the matching closing bracket
      let bracketCount = 0;
      let lastBracket = -1;
      let inString = false;
      let escapeNext = false;
      
      for (let i = firstBracket; i < jsonString.length; i++) {
        const char = jsonString[i];
        
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        
        if (char === '\\') {
          escapeNext = true;
          continue;
        }
        
        if (char === '"') {
          inString = !inString;
          continue;
        }
        
        if (!inString) {
          if (char === '[') {
            bracketCount++;
          } else if (char === ']') {
            bracketCount--;
            if (bracketCount === 0) {
              lastBracket = i;
              break;
            }
          }
        }
      }

      if (lastBracket === -1) {
        console.error('❌ No matching closing bracket found');
        console.error('Bracket count ended at:', bracketCount);
        console.error('First 500 chars:', jsonString.substring(0, 500));
        console.error('Last 500 chars:', jsonString.substring(Math.max(0, jsonString.length - 500)));
        console.error('Total length:', jsonString.length);
        throw new Error('Failed to parse attack tree from response - incomplete JSON (response was likely cut off)');
      }

      let attackTreeJson = jsonString.substring(firstBracket, lastBracket + 1);
      console.log('🎯 Extracted JSON array length:', attackTreeJson.length);

      // Clean up the JSON - only normalize whitespace and remove trailing commas
      let cleanedJson = attackTreeJson
        // Remove actual newlines/returns/tabs
        .replace(/\r\n/g, ' ')
        .replace(/\n/g, ' ')
        .replace(/\r/g, ' ')
        .replace(/\t/g, ' ')
        // Remove trailing commas before closing braces/brackets
        .replace(/,(\s*[}\]])/g, '$1')
        // Normalize multiple spaces
        .replace(/\s+/g, ' ')
        .trim();

      console.log('🔧 Cleaned JSON preview:', cleanedJson.substring(0, 500));

      let nodes: AttackTreeNode[];
      try {
        nodes = JSON.parse(cleanedJson);
      } catch (parseError: any) {
        console.error('❌ JSON Parse Error:', parseError.message);
        console.error('Failed JSON (first 1000 chars):', cleanedJson.substring(0, 1000));
        console.error('Failed JSON (last 500 chars):', cleanedJson.substring(cleanedJson.length - 500));
        
        // Last resort: try to fix common remaining issues
        const finalCleanup = cleanedJson
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']')
          .replace(/"\s+"/g, '""');
        
        console.log('🔧 Final cleanup attempt');
        try {
          nodes = JSON.parse(finalCleanup);
        } catch (finalError: any) {
          console.error('❌ Final parse failed:', finalError.message);
          throw new Error(`JSON parsing failed: ${parseError.message}`);
        }
      }
      
      // Emit nodes progressively
      if (onNodeUpdate) {
        for (const node of nodes) {
          onNodeUpdate(node);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      return nodes;
    } catch (error: any) {
      console.error('Error generating attack tree:', error);
      
      // Check if it's a rate limit error
      if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
        return [{
          id: 'rate-limit',
          name: '⏳ Rate Limit Exceeded',
          description: `You've hit the free tier quota limit. Please wait ~${error.errorDetails?.[2]?.retryDelay || '60s'} or upgrade your API key. Free tier: 20 requests/day for gemini-2.5-flash, 1500 requests/day for gemini-flash-lite.`,
          severity: 'low'
        }];
      }
      
      return [{
        id: 'error',
        name: 'Analysis Error',
        description: `Failed to generate attack tree: ${error.message || 'Unknown error'}. Please check your input and try again.`,
        severity: 'low'
      }];
    }
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

    try {
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
    } catch (error) {
      console.error('Error in thinking mode:', error);
      return [];
    }
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

    try {
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
    } catch (error) {
      console.error('Error generating exploits:', error);
      return [];
    }
  }

  /**
   * NEW: Generate code fixes for vulnerable files in repository
   * Uses latest Gemini 2.0 Flash Thinking to provide comprehensive fixes
   */
  async generateCodeFixes(
    vulnerabilities: AttackTreeNode[],
    gitInfo?: GitRepoInfo
  ): Promise<Array<{ file: string; originalCode: string; fixedCode: string; explanation: string }>> {
    if (!vulnerabilities.length || !gitInfo) return [];

    const prompt = `You are an expert security engineer tasked with fixing vulnerabilities in a codebase.

REPOSITORY: ${gitInfo.url}
TECHNOLOGIES: ${gitInfo.technologies.join(', ')}

VULNERABILITIES TO FIX:
${JSON.stringify(vulnerabilities.map(v => ({
  name: v.name,
  severity: v.severity,
  description: v.description,
  affectedFiles: v.affectedFiles,
  codeSnippets: v.codeSnippets
})), null, 2)}

For EACH vulnerable code snippet, provide:
1. The exact original vulnerable code
2. The secure, fixed version
3. Detailed explanation of the fix
4. Security best practices applied

Output as JSON array:
[{
  "file": "path/to/file.js",
  "originalCode": "vulnerable code here",
  "fixedCode": "secure code here with comments",
  "explanation": "Why this fix works and what security principles it implements"
}]

Ensure fixes are:
✓ Production-ready
✓ Follow language best practices
✓ Maintain functionality
✓ Add input validation
✓ Include security comments
✓ Handle edge cases`;

    try {
      const result = await this.thinkingModel.generateContent(prompt);
      const response = result.response.text();
      
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return [];

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error generating code fixes:', error);
      return [];
    }
  }

  /**
   * NEW: Comprehensive vulnerability scanner with OWASP Top 10 coverage
   */
  async deepSecurityScan(
    target: string,
    gitInfo?: GitRepoInfo
  ): Promise<{
    owaspFindings: Array<{ category: string; findings: string[]; severity: string }>;
    recommendations: string[];
    riskScore: number;
  }> {
    const gitContext = gitInfo ? `
CODEBASE ANALYSIS:
Repository: ${gitInfo.url}
Technologies: ${gitInfo.technologies.join(', ')}
Total Files: ${gitInfo.files.length}
Secrets Found: ${gitInfo.secretsFound ? 'YES ⚠️' : 'NO'}
` : '';

    const prompt = `Perform COMPREHENSIVE security audit on: ${target}

${gitContext}

Analyze against OWASP Top 10 (2024):
1. Broken Access Control
2. Cryptographic Failures
3. Injection
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable & Outdated Components
7. Identification & Authentication Failures
8. Software & Data Integrity Failures
9. Security Logging & Monitoring Failures
10. Server-Side Request Forgery (SSRF)

Output as JSON:
{
  "owaspFindings": [
    {
      "category": "A01:2024 - Broken Access Control",
      "findings": ["specific finding 1", "finding 2"],
      "severity": "critical|high|medium|low"
    }
  ],
  "recommendations": ["prioritized recommendation 1", "rec 2"],
  "riskScore": 85
}

Be thorough and technical. Include line numbers and file paths.`;

    try {
      const result = await this.thinkingModel.generateContent(prompt);
      const response = result.response.text();
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return { owaspFindings: [], recommendations: [], riskScore: 0 };
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error in deep security scan:', error);
      return { owaspFindings: [], recommendations: [], riskScore: 0 };
    }
  }
}
