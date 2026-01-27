# War Room - Automated Penetration Testing & Reconnaissance

A real-time cybersecurity reconnaissance tool built for the Gemini Hackathon. Watch as AI analyzes targets, generates attack trees, and executes exploits in a secure Docker sandbox.

## 🎯 Features

- **URL/Repo Analysis**: Paste any URL or GitHub repository for instant reconnaissance
- **Image Upload**: Upload screenshots or hardware photos for enhanced analysis
- **Live Attack Tree**: Watch the attack tree grow in real-time as vulnerabilities are discovered
- **Gemini Thinking Mode**: See AI's step-by-step reasoning with Gemini 2.0 Flash Thinking
- **Exploit Generator**: Automatically generates Python/Bash exploit scripts
- **Docker Sandbox**: Safely execute exploits in isolated containers
- **Real-time Dashboard**: Monitor results, outputs, and execution status

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Docker Desktop (running)
- Gemini API Key ([Get one here](https://ai.google.dev/))

### Easy Setup

**Option 1: Automated Setup (Recommended)**

Windows:
```bash
.\setup.bat
```

macOS/Linux:
```bash
chmod +x setup.sh
./setup.sh
```

**Option 2: Manual Setup**

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up API environment:
   ```bash
   cd apps/api
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_key_here
   ```

3. Start Docker Desktop

4. Run the project:
   ```bash
   pnpm dev
   ```

### Access the App

- **Web Interface**: http://localhost:3000
- **API Server**: http://localhost:3001

## 📖 Usage

1. Open http://localhost:3000
2. Enter a target URL or GitHub repo
3. (Optional) Upload a screenshot or hardware photo
4. Click **"Launch Recon"**
5. Watch the magic happen:
   - ✅ Attack tree builds in real-time
   - ✅ AI thinking steps stream live
   - ✅ Exploits generate automatically
   - ✅ Scripts execute in Docker sandbox
   - ✅ Results appear on dashboard

## 🏗️ Architecture

```
War_Room/
├── apps/
│   ├── api/              # Express + Socket.IO backend
│   │   ├── src/
│   │   │   ├── services/
│   │   │   │   ├── geminiService.ts    # Gemini AI integration
│   │   │   │   ├── dockerService.ts    # Docker execution
│   │   │   │   └── reconService.ts     # Main recon logic
│   │   │   ├── routes/
│   │   │   │   └── recon.ts            # API endpoints
│   │   │   └── index.ts                # Server setup
│   │   └── package.json
│   │
│   └── web/              # Next.js frontend
│       ├── app/
│       │   ├── page.tsx                 # Main page
│       │   └── layout.tsx               # Root layout
│       ├── components/
│       │   ├── ReconInput.tsx          # Input form
│       │   ├── AttackTree.tsx          # Tree visualization
│       │   ├── ThinkingDisplay.tsx     # AI thinking
│       │   └── ResultsDashboard.tsx    # Results view
│       ├── hooks/
│       │   └── useRecon.ts             # Recon logic
│       └── package.json
│
└── packages/             # Shared packages
```

## 🔧 Tech Stack

**Backend:**
- Express.js - Web framework
- Socket.IO - Real-time communication
- Google Generative AI - Gemini 2.0 integration
- Dockerode - Docker API client
- TypeScript - Type safety

**Frontend:**
- Next.js 16 - React framework
- React 19 - UI library
- TailwindCSS - Styling
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

### Gemini 2.0 Flash Exp
- Ultra-fast attack tree generation
- Exploit script creation
- Multimodal analysis (text + images)

### Gemini 2.0 Flash Thinking Exp
- Deep vulnerability analysis
- Step-by-step reasoning
- Exploitation strategy planning
- Transparent AI decision-making

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
