import { GoogleGenerativeAI } from '@google/generative-ai';
import { AttackTreeNode, ThinkingStep, Exploit } from '../types';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private thinkingModel: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    this.thinkingModel = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-thinking-exp-01-21'
    });
  }

  async generateAttackTree(
    target: string, 
    image?: { buffer: Buffer; mimetype: string; originalname: string },
    onNodeUpdate?: (node: AttackTreeNode) => void
  ): Promise<AttackTreeNode[]> {
    const prompt = `You are a cybersecurity expert performing reconnaissance on a target: ${target}

${image ? 'An image/screenshot has been provided for additional context.' : ''}

Generate a comprehensive attack tree with potential vulnerabilities and attack vectors.
For each node, provide:
1. A clear name
2. Detailed description
3. Severity level (critical, high, medium, low)
4. Child nodes for sub-attacks

Output as JSON array of attack tree nodes with this structure:
{
  "id": "unique_id",
  "name": "Attack Vector Name",
  "description": "Detailed description",
  "severity": "high",
  "children": []
}`;

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
    } catch (error) {
      console.error('Error generating attack tree:', error);
      return [{
        id: 'error',
        name: 'Analysis Error',
        description: 'Failed to generate attack tree',
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
    const prompt = `As a penetration testing expert, analyze this target: ${target}

Attack tree found:
${JSON.stringify(attackTree, null, 2)}

Think through:
1. The most critical vulnerabilities
2. Exploitation difficulty and likelihood
3. Potential impact
4. Recommended attack sequence
5. Defense mechanisms to bypass

Provide your detailed thinking process.`;

    try {
      const result = await this.thinkingModel.generateContent(prompt);
      const response = result.response.text();
      
      const steps: ThinkingStep[] = [];
      const thoughts = response.split('\n\n').filter(t => t.trim());
      
      for (let i = 0; i < thoughts.length; i++) {
        const step: ThinkingStep = {
          id: `thinking_${i}`,
          step: i + 1,
          thought: thoughts[i].trim(),
          reasoning: `Analysis step ${i + 1}`,
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

    const prompt = `Based on this reconnaissance analysis:

Target: ${target}
High-priority vulnerabilities:
${highSeverityNodes.map(n => `- ${n.name}: ${n.description}`).join('\n')}

Generate practical exploit scripts (Python or Bash) for the top vulnerabilities.
For each exploit, provide:
1. Name
2. Description
3. Complete working script
4. Language (python/bash)
5. Severity
6. Category

Output as JSON array:
[{
  "name": "Exploit Name",
  "description": "What it does",
  "script": "complete script code",
  "language": "python",
  "severity": "high",
  "category": "Web/Network/etc"
}]`;

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
}
