import type { SecurityReport, AttackTreeNode, Exploit } from '../types/index.js';

export class ReportService {
  generateHTMLReport(report: SecurityReport): string {
    const { summary, attackTree, exploits, target, timestamp } = report;
    const date = new Date(timestamp).toLocaleString();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security Assessment Report - ${target}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 100%);
            color: #e0e0e0;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .header .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
        }
        .meta {
            background: #222;
            padding: 20px 40px;
            border-bottom: 1px solid #333;
        }
        .meta-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        .meta-item {
            display: flex;
            flex-direction: column;
        }
        .meta-label {
            font-size: 0.85em;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        .meta-value {
            font-size: 1.1em;
            font-weight: 600;
        }
        .summary {
            padding: 40px;
            background: #1a1a1a;
        }
        .summary h2 {
            color: #dc2626;
            margin-bottom: 20px;
            font-size: 1.8em;
        }
        .severity-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .severity-card {
            background: #222;
            padding: 25px;
            border-radius: 8px;
            border-left: 4px solid;
            transition: transform 0.2s;
        }
        .severity-card:hover {
            transform: translateY(-2px);
        }
        .severity-card.critical { border-color: #dc2626; }
        .severity-card.high { border-color: #f97316; }
        .severity-card.medium { border-color: #eab308; }
        .severity-card.low { border-color: #3b82f6; }
        .severity-card .count {
            font-size: 3em;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .severity-card .label {
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.8;
        }
        .critical .count { color: #dc2626; }
        .high .count { color: #f97316; }
        .medium .count { color: #eab308; }
        .low .count { color: #3b82f6; }
        .section {
            padding: 40px;
            border-top: 1px solid #333;
        }
        .section h2 {
            color: #dc2626;
            margin-bottom: 25px;
            font-size: 1.8em;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .vulnerability {
            background: #222;
            padding: 25px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid;
        }
        .vulnerability.critical { border-color: #dc2626; }
        .vulnerability.high { border-color: #f97316; }
        .vulnerability.medium { border-color: #eab308; }
        .vulnerability.low { border-color: #3b82f6; }
        .vulnerability h3 {
            color: #fff;
            margin-bottom: 10px;
            font-size: 1.3em;
        }
        .vulnerability .severity-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 0.75em;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 15px;
        }
        .severity-badge.critical { background: #dc2626; color: white; }
        .severity-badge.high { background: #f97316; color: white; }
        .severity-badge.medium { background: #eab308; color: black; }
        .severity-badge.low { background: #3b82f6; color: white; }
        .vulnerability p {
            margin-bottom: 15px;
            color: #ccc;
        }
        .code-section {
            background: #0a0a0a;
            border: 1px solid #333;
            border-radius: 4px;
            padding: 15px;
            margin-top: 15px;
            overflow-x: auto;
        }
        .code-section h4 {
            color: #888;
            font-size: 0.9em;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        .code-snippet {
            background: #000;
            border-left: 3px solid #dc2626;
            padding: 15px;
            margin: 10px 0;
            border-radius: 4px;
        }
        .code-snippet .file-path {
            color: #f97316;
            font-family: monospace;
            font-size: 0.9em;
            margin-bottom: 5px;
        }
        .code-snippet pre {
            color: #22c55e;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            white-space: pre-wrap;
            margin: 10px 0;
        }
        .code-snippet .issue {
            color: #eab308;
            font-style: italic;
            margin-top: 10px;
        }
        .remediation {
            background: #0a2a0a;
            border: 1px solid #22c55e;
            border-radius: 4px;
            padding: 15px;
            margin-top: 15px;
        }
        .remediation h4 {
            color: #22c55e;
            margin-bottom: 10px;
        }
        .remediation p {
            color: #ccc;
        }
        .exploit {
            background: #222;
            padding: 25px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #333;
        }
        .exploit h3 {
            color: #f97316;
            margin-bottom: 10px;
        }
        .exploit .language {
            display: inline-block;
            background: #333;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 0.85em;
            margin-bottom: 15px;
        }
        .exploit pre {
            background: #0a0a0a;
            border: 1px solid #333;
            border-radius: 4px;
            padding: 15px;
            overflow-x: auto;
            color: #22c55e;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        .footer {
            background: #0a0a0a;
            padding: 30px;
            text-align: center;
            color: #666;
            border-top: 1px solid #333;
        }
        @media print {
            body { background: white; color: black; }
            .container { border: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 WAR ROOM SECURITY ASSESSMENT</h1>
            <div class="subtitle">Offensive Security Reconnaissance Report</div>
        </div>
        
        <div class="meta">
            <div class="meta-grid">
                <div class="meta-item">
                    <div class="meta-label">Target</div>
                    <div class="meta-value">${this.escapeHtml(target)}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Generated</div>
                    <div class="meta-value">${date}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Session ID</div>
                    <div class="meta-value">${report.sessionId}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Total Issues</div>
                    <div class="meta-value">${summary.criticalIssues + summary.highIssues + summary.mediumIssues + summary.lowIssues}</div>
                </div>
            </div>
        </div>

        <div class="summary">
            <h2>📊 Executive Summary</h2>
            <div class="severity-grid">
                <div class="severity-card critical">
                    <div class="count">${summary.criticalIssues}</div>
                    <div class="label">Critical</div>
                </div>
                <div class="severity-card high">
                    <div class="count">${summary.highIssues}</div>
                    <div class="label">High</div>
                </div>
                <div class="severity-card medium">
                    <div class="count">${summary.mediumIssues}</div>
                    <div class="label">Medium</div>
                </div>
                <div class="severity-card low">
                    <div class="count">${summary.lowIssues}</div>
                    <div class="label">Low</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>🎯 Vulnerabilities Discovered</h2>
            ${attackTree.map(vuln => this.generateVulnerabilityHTML(vuln)).join('')}
        </div>

        ${exploits.length > 0 ? `
        <div class="section">
            <h2>💣 Proof-of-Concept Exploits</h2>
            ${exploits.map(exploit => this.generateExploitHTML(exploit)).join('')}
        </div>
        ` : ''}

        ${report.recommendations && report.recommendations.length > 0 ? `
        <div class="section">
            <h2>💡 Remediation Recommendations</h2>
            ${report.recommendations.map(rec => `<div class="remediation"><p>${this.escapeHtml(rec)}</p></div>`).join('')}
        </div>
        ` : ''}

        <div class="footer">
            <p>Generated by WAR ROOM v3.0 - Automated Offensive Cyber Operations</p>
            <p>⚠️ This report contains sensitive security information. Handle with care.</p>
        </div>
    </div>
</body>
</html>`;
  }

  private generateVulnerabilityHTML(vuln: AttackTreeNode): string {
    return `
        <div class="vulnerability ${vuln.severity}">
            <h3>${this.escapeHtml(vuln.name)}</h3>
            <span class="severity-badge ${vuln.severity}">${vuln.severity}</span>
            <p>${this.escapeHtml(vuln.description)}</p>
            
            ${vuln.cve ? `<p><strong>CVE:</strong> ${this.escapeHtml(vuln.cve)}</p>` : ''}
            
            ${vuln.affectedFiles && vuln.affectedFiles.length > 0 ? `
                <div class="code-section">
                    <h4>📁 Affected Files</h4>
                    ${vuln.affectedFiles.map(file => `<div style="color: #f97316; font-family: monospace;">• ${this.escapeHtml(file)}</div>`).join('')}
                </div>
            ` : ''}
            
            ${vuln.codeSnippets && vuln.codeSnippets.length > 0 ? `
                <div class="code-section">
                    <h4>💻 Vulnerable Code</h4>
                    ${vuln.codeSnippets.map(snippet => `
                        <div class="code-snippet">
                            <div class="file-path">${this.escapeHtml(snippet.file)} (Lines ${snippet.lineStart}-${snippet.lineEnd})</div>
                            <pre>${this.escapeHtml(snippet.code)}</pre>
                            <div class="issue">⚠️ ${this.escapeHtml(snippet.issue)}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${vuln.remediation ? `
                <div class="remediation">
                    <h4>✅ Remediation</h4>
                    <p>${this.escapeHtml(vuln.remediation)}</p>
                </div>
            ` : ''}
        </div>
    `;
  }

  private generateExploitHTML(exploit: Exploit): string {
    return `
        <div class="exploit">
            <h3>${this.escapeHtml(exploit.name)}</h3>
            <span class="language">${exploit.language}</span>
            <span class="severity-badge ${exploit.severity}">${exploit.severity}</span>
            <p>${this.escapeHtml(exploit.description)}</p>
            <pre>${this.escapeHtml(exploit.script)}</pre>
        </div>
    `;
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  generateMarkdownReport(report: SecurityReport): string {
    const { summary, attackTree, exploits, target, timestamp } = report;
    const date = new Date(timestamp).toLocaleString();

    return `# 🔒 WAR ROOM SECURITY ASSESSMENT REPORT

**Target:** ${target}  
**Generated:** ${date}  
**Session ID:** ${report.sessionId}

---

## 📊 Executive Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | ${summary.criticalIssues} |
| 🟠 High | ${summary.highIssues} |
| 🟡 Medium | ${summary.mediumIssues} |
| 🔵 Low | ${summary.lowIssues} |
| **Total** | **${summary.criticalIssues + summary.highIssues + summary.mediumIssues + summary.lowIssues}** |

---

## 🎯 Vulnerabilities Discovered

${attackTree.map((vuln, i) => `
### ${i + 1}. ${vuln.name} \`${vuln.severity.toUpperCase()}\`

**Description:** ${vuln.description}

${vuln.cve ? `**CVE:** ${vuln.cve}\n\n` : ''}
${vuln.affectedFiles && vuln.affectedFiles.length > 0 ? `**Affected Files:**\n${vuln.affectedFiles.map(f => `- \`${f}\``).join('\n')}\n\n` : ''}
${vuln.codeSnippets && vuln.codeSnippets.length > 0 ? `**Vulnerable Code:**\n${vuln.codeSnippets.map(cs => `
\`\`\`${cs.file.split('.').pop() || 'text'}
// ${cs.file} (Lines ${cs.lineStart}-${cs.lineEnd})
${cs.code}
// Issue: ${cs.issue}
\`\`\`
`).join('\n')}\n` : ''}
${vuln.remediation ? `**Remediation:**\n${vuln.remediation}\n\n` : ''}
---
`).join('\n')}

${exploits.length > 0 ? `
## 💣 Proof-of-Concept Exploits

${exploits.map((exploit, i) => `
### ${i + 1}. ${exploit.name} [\`${exploit.language}\`]

**Description:** ${exploit.description}

**Severity:** \`${exploit.severity.toUpperCase()}\`  
**Category:** ${exploit.category}

\`\`\`${exploit.language}
${exploit.script}
\`\`\`

---
`).join('\n')}
` : ''}

${report.recommendations && report.recommendations.length > 0 ? `
## 💡 Remediation Recommendations

${report.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}
` : ''}

---

*Generated by WAR ROOM v3.0 - Automated Offensive Cyber Operations*

⚠️ **This report contains sensitive security information. Handle with care.**
`;
  }
}
