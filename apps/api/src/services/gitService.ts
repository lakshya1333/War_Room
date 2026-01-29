import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import type { GitRepoInfo } from '../types/index.js';

const execAsync = promisify(exec);

export class GitService {
  private tempDir = path.join(process.cwd(), 'temp');

  async analyzeRepository(repoUrl: string): Promise<GitRepoInfo> {
    try {
      // Ensure temp directory exists
      await fs.mkdir(this.tempDir, { recursive: true });

      // Extract repo name
      const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 'repo';
      const repoPath = path.join(this.tempDir, repoName);

      // Clone repository (shallow clone for speed)
      console.log(`Cloning repository: ${repoUrl}`);
      await execAsync(`git clone --depth 1 ${repoUrl} "${repoPath}"`);

      // Get list of all files
      const files = await this.getAllFiles(repoPath);

      // Detect technologies
      const technologies = await this.detectTechnologies(repoPath, files);

      // Find package and config files
      const packageFiles = files.filter(f => 
        f.endsWith('package.json') || 
        f.endsWith('requirements.txt') ||
        f.endsWith('pom.xml') ||
        f.endsWith('Gemfile') ||
        f.endsWith('go.mod') ||
        f.endsWith('Cargo.toml')
      );

      const configFiles = files.filter(f =>
        f.includes('.config') ||
        f.includes('.env') ||
        f.endsWith('.yaml') ||
        f.endsWith('.yml') ||
        f.endsWith('.json') ||
        f.endsWith('.xml')
      );

      // Check for potential secrets
      const secretsFound = await this.scanForSecrets(repoPath, files);

      // Cleanup
      await execAsync(`rm -rf "${repoPath}"`).catch(() => {});

      return {
        url: repoUrl,
        files: files.map(f => f.replace(repoPath + path.sep, '')),
        technologies,
        packageFiles: packageFiles.map(f => f.replace(repoPath + path.sep, '')),
        configFiles: configFiles.map(f => f.replace(repoPath + path.sep, '')),
        secretsFound
      };
    } catch (error: any) {
      console.error('Error analyzing repository:', error);
      throw new Error(`Failed to analyze repository: ${error.message}`);
    }
  }

  private async getAllFiles(dir: string, fileList: string[] = []): Promise<string[]> {
    try {
      const files = await fs.readdir(dir);

      for (const file of files) {
        // Skip common directories we don't want to analyze
        if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') {
          continue;
        }

        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) {
          await this.getAllFiles(filePath, fileList);
        } else {
          fileList.push(filePath);
        }
      }
    } catch (error) {
      // Ignore errors for individual files
    }

    return fileList;
  }

  private async detectTechnologies(repoPath: string, files: string[]): Promise<string[]> {
    const technologies = new Set<string>();

    const patterns = {
      'JavaScript/Node.js': ['package.json', '.js', '.jsx'],
      'TypeScript': ['.ts', '.tsx', 'tsconfig.json'],
      'Python': ['.py', 'requirements.txt', 'setup.py'],
      'Java': ['.java', 'pom.xml', '.gradle'],
      'Ruby': ['.rb', 'Gemfile'],
      'Go': ['.go', 'go.mod'],
      'Rust': ['.rs', 'Cargo.toml'],
      'PHP': ['.php', 'composer.json'],
      'C#/.NET': ['.cs', '.csproj'],
      'Docker': ['Dockerfile', 'docker-compose.yml'],
      'Kubernetes': ['deployment.yaml', 'service.yaml'],
      'React': ['react', 'jsx'],
      'Vue': ['vue'],
      'Angular': ['angular'],
      'Next.js': ['next.config'],
      'Express': ['express'],
      'Django': ['django', 'manage.py'],
      'Flask': ['flask'],
      'Spring': ['spring'],
    };

    const fileNames = files.map(f => f.toLowerCase());

    for (const [tech, patterns_list] of Object.entries(patterns)) {
      for (const pattern of patterns_list) {
        if (fileNames.some(f => f.includes(pattern.toLowerCase()))) {
          technologies.add(tech);
          break;
        }
      }
    }

    return Array.from(technologies);
  }

  private async scanForSecrets(repoPath: string, files: string[]): Promise<boolean> {
    const secretPatterns = [
      /api[_-]?key/i,
      /secret[_-]?key/i,
      /password/i,
      /passwd/i,
      /token/i,
      /bearer/i,
      /authorization/i,
      /aws[_-]?access/i,
      /private[_-]?key/i,
    ];

    // Check .env files and config files
    const suspiciousFiles = files.filter(f => 
      f.includes('.env') || 
      f.includes('config') ||
      f.includes('secret')
    );

    for (const file of suspiciousFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        for (const pattern of secretPatterns) {
          if (pattern.test(content)) {
            return true;
          }
        }
      } catch (error) {
        // Ignore read errors
      }
    }

    return false;
  }
}
