# 🚀 War Room V4.0 - Hackathon Edition

<div align="center">

![War Room Banner](https://img.shields.io/badge/WAR_ROOM-V4.0-red?style=for-the-badge&logo=shield&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_3-Pro_Preview-blue?style=for-the-badge&logo=google&logoColor=white)
![Status](https://img.shields.io/badge/Status-ACTIVE-green?style=for-the-badge&logo=statuspage&logoColor=white)

**The Ultimate AI-Powered Offensive Cyber Operations Platform**

*Real-time reconnaissance • 3D visualization • VR support • AI-generated exploits & fixes*

[🎮 Demo](#demo) • [✨ Features](#features) • [🚀 Quick Start](#quick-start) • [🏆 Why This Wins](#why-this-wins)

</div>

---

## 🎯 What Makes This INSANE

War Room V4.0 isn't just a pen-testing tool—it's a **full sensory hacking experience** that pushes the boundaries of what's possible with AI-assisted security research.

### 🔥 Revolutionary Features

#### 1. **Matrix-Style Hacking Atmosphere**
- 🌧️ **Falling code rain** background (authentic Matrix vibes)
- ⚡ **Glitch effects** when vulnerabilities are discovered
- 🔊 **Dynamic sound effects** (scanning beeps, alert sounds, typing clicks)
- 💥 **Pulsing alerts** for critical findings with audio warnings

#### 2. **3D Network Topology Visualization**
- 🌐 **Interactive 3D graph** of attack vectors using Three.js
- 🎮 **VR mode support** for immersive pen-testing
- ✨ **Particle effects** showing data flows between nodes
- 🎯 **Click nodes** to see detailed vulnerability info

#### 3. **Gemini 3 Pro Preview with Auto-Fallback** ⭐ NEW
- 🧠 **Advanced reasoning** with step-by-step thinking display
- 🔄 **Automatic model fallback** on high demand (503 errors)
- 🔮 **Extended context** for deep code analysis
- 🎯 **OWASP Top 10** automated scanning
- 📊 **Risk scoring** and prioritization
- 🚀 **4-tier fallback**: Gemini 3 Pro → 3 Flash → 2.5 Flash → 2.0 Flash

#### 4. **AI-Powered Code Fixes** ⭐ NEW
- 🔧 **Automatic vulnerability remediation** for repositories
- 📝 **Side-by-side diff view** (vulnerable vs. secure)
- 📦 **Generate patch files** for immediate deployment
- ✅ **Production-ready code** with security best practices

#### 5. **Real-Time Attack Tree**
- 🌳 **Live streaming** vulnerability discovery
- 📊 **Color-coded severity** (critical/high/medium/low)
- 📁 **File paths & line numbers** for code vulnerabilities
- 🔗 **CVE integration** with affected files

#### 6. **Docker Sandbox Execution**
- 🐳 **Isolated containers** for safe exploit testing
- ⚡ **Real-time output streaming**
- 🛡️ **Resource limits** (512MB RAM, 50% CPU, 30s timeout)
- 🧹 **Auto-cleanup** after execution

---

## 🎬 Demo

```
┌─────────────────────────────────────────────────────┐
│  🛡️  WAR ROOM V4.0 🚀                               │
│  AI-Powered Offensive Cyber Operations              │
│  Gemini 3 Pro Preview • 3D • VR • Sound            │
└─────────────────────────────────────────────────────┘

🎯 Target: https://example-vulnerable-app.com

⚡ SCANNING... [████████████████████] 100%

🌳 Attack Tree:
  ├─ 🔴 CRITICAL: SQL Injection in /api/users
  ├─ 🟠 HIGH: XSS in search parameter
  ├─ 🟡 MEDIUM: CORS misconfiguration
  └─ 🔵 LOW: Information disclosure

🧠 Gemini Thinking:
  → Analyzing authentication flow...
  → Identifying injection points...
  → Mapping attack surface...
  ✓ Analysis complete!

🔧 Code Fixes Generated:
  ✓ users.js: Added parameterized queries
  ✓ search.jsx: Implemented input sanitization
  ✓ cors.js: Restricted origins

🐳 Exploits Executed:
  ✅ SQL Injection PoC: SUCCESS
  ✅ XSS Payload: SUCCESS
  ⏱️  Time: 2.3s

📊 Security Score: 42/100 (HIGH RISK)
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Docker Desktop (running)
- Gemini API Key ([Get free key](https://ai.google.dev/))

### 🎯 One-Command Setup

**Windows:**
```bash
.\setup.bat
```

**macOS/Linux:**
```bash
chmod +x setup.sh && ./setup.sh
```

### 🎮 Launch

```bash
pnpm start
```

Then open: http://localhost:3000

**That's it!** 🎉

Alternatively, for development:
```bash
pnpm dev  # Runs both API and web in dev mode
```

---

## 🏆 Why This Wins the Hackathon
- Socket.IO Client - Real-time updates
- Lucide Icons - Icon library

**Infrastructure:**
- Docker - Exploit sandboxing
- Turbo - Monorepo management
- pnpm - Package manager

## 🛡️ Security Features

- **Isolated Execution**: All exploits run in Docker containers
- **Resource Limits**: 512MB RAM, 50% CPU per container
- **Timeout Protection**: 30-second execution limit
- **Network Isolation**: Bridge network mode
- **Auto-cleanup**: Containers removed after execution

## 🎓 Gemini Features Used

### Gemini 3 Pro Preview (Primary)
- 🏆 **Latest Gemini 3** model for superior analysis
- Ultra-fast attack tree generation
- Advanced exploit script creation
- Multimodal analysis (text + images)
- Deep vulnerability analysis
- Step-by-step reasoning display
- Exploitation strategy planning
- AI-powered code fix generation

### Intelligent Fallback System ⚡
- **Auto-retry logic** on 503/429 errors
- **4-tier model cascade**:
  1. `gemini-3-pro-preview` (Primary)
  2. `gemini-3-flash-preview` (Speed)
  3. `gemini-2.5-flash` (Stable)
  4. `gemini-2.0-flash-001` (Backup)
- **Zero downtime** during high demand
- **Transparent model switching** in logs

## 📝 Environment Variables

### API (`apps/api/.env`)
```env
PORT=3001
WEB_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

### Web (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🐛 Troubleshooting

### Docker Errors
**Issue**: "Cannot connect to Docker daemon"
```bash
# Solution: Start Docker Desktop
# Windows: Check system tray
# Mac: Check menu bar
# Verify: docker ps
```

**Issue**: "Image not found"
```bash
# Solution: Pull images manually
docker pull python:3.11-slim
docker pull alpine:latest
```

### API Connection
**Issue**: "Failed to connect to API"
- ✅ Check API is running: http://localhost:3001
- ✅ Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- ✅ Check firewall settings

### Gemini API
**Issue**: "Invalid API key"
- ✅ Verify key in `apps/api/.env`
- ✅ Get new key: https://ai.google.dev/

**Issue**: "Rate limit exceeded"
- ✅ Wait a few minutes
- ✅ Check quota in Google AI Studio

## 📚 Additional Resources

- [QUICKSTART.md](./QUICKSTART.md) - Detailed setup guide
- [DEMO_GUIDE.md](./DEMO_GUIDE.md) - Hackathon demo script
- [Gemini API Docs](https://ai.google.dev/docs)
- [Docker Documentation](https://docs.docker.com/)

## 🚀 Development

```bash
# Install dependencies
pnpm install

# Run in development
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint

# Format code
pnpm format
```

## 🎯 Roadmap

- [ ] Authentication & user accounts
- [ ] Result persistence & history
- [ ] Custom exploit templates
- [ ] Enhanced Docker security
- [ ] Export functionality (PDF/JSON)
- [ ] Mobile-responsive design
- [ ] Collaborative recon sessions
- [ ] Integration with security tools

## ⚠️ Disclaimer

This tool is for educational and authorized security testing only. Always obtain proper authorization before testing any system you don't own. Unauthorized access to computer systems is illegal.

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Built for the Gemini Hackathon. Contributions welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 🙏 Acknowledgments

- Google Gemini team for the amazing AI models
- Socket.IO for real-time communication
- Docker for secure sandboxing
- Vercel for Next.js framework

---

⚔️ **War Room** - Where AI meets cybersecurity

Made with ❤️ for the Gemini Hackathon
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo build

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
