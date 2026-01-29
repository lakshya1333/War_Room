# Deployment Guide for Render

## Quick Deploy Steps

### 1. Push to GitHub
Ensure your code is pushed to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy on Render

#### Option A: Using Blueprint (Recommended)
1. Go to https://dashboard.render.com
2. Click **New** → **Blueprint**
3. Connect your GitHub repository
4. Render will detect `render.yaml` and create both services automatically

#### Option B: Manual Setup

**API Service:**
1. New → Web Service
2. Connect your GitHub repo
3. Settings:
   - **Name:** war-room-api
   - **Root Directory:** (leave blank)
   - **Build Command:** `cd apps/api && pnpm install --prod=false && pnpm build`
   - **Start Command**: `node apps/api/dist/index.js`
   - **Plan:** Free

**Web Service:**
1. New → Web Service
2. Connect your GitHub repo
3. Settings:
   - **Name:** war-room-web
   - **Root Directory:** (leave blank)
   - **Build Command:** `cd apps/web && pnpm install --prod=false && pnpm build`
   - **Start Command:** `cd apps/web && pnpm start`
   - **Plan:** Free

### 3. Configure Environment Variables

After services are created, add these in Render dashboard:

**API Service (war-room-api):**
- `GEMINI_API_KEY`: Your Google Gemini API key
- `NODE_ENV`: production
- `PORT`: 3001
- `WEB_URL`: https://war-room-web.onrender.com (update with your actual web URL)

**Web Service (war-room-web):**
- `NEXT_PUBLIC_API_URL`: https://war-room-api.onrender.com (update with your actual API URL)
- `NODE_ENV`: production

### 4. Update URLs

After both services are deployed:
1. Copy the API URL from Render (e.g., https://war-room-api.onrender.com)
2. Update `NEXT_PUBLIC_API_URL` in Web Service environment variables
3. Copy the Web URL (e.g., https://war-room-web.onrender.com)
4. Update `WEB_URL` in API Service environment variables
5. Click "Manual Deploy" → "Clear build cache & deploy" for both services

## Important Notes

### Free Tier Limitations
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30-60 seconds to wake up
- Limited to 750 hours/month per service

### WebSocket Considerations
- Socket.IO connections work on Render
- May disconnect when service spins down
- Frontend should handle reconnection automatically

### Security
- Never commit `.env` files
- Add API keys only through Render dashboard
- Keep `GEMINI_API_KEY` secure

## Troubleshooting

### Build Fails
- Check that pnpm is properly configured
- Verify all dependencies are in package.json
- Check build logs in Render dashboard

### Services Can't Connect
- Verify environment variables are set correctly
- Check CORS settings allow your frontend URL
- Ensure both services are running

### WebSocket Issues
- Check API service logs
- Verify WEB_URL matches your actual web URL
- Test socket connection in browser console

## Health Checks

API health endpoint: `https://your-api-url.onrender.com/health`

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-29T...",
  "uptime": 123.45
}
```

## Local Testing Before Deploy

Test production build locally:
```bash
# Build everything
pnpm build

# Test API
cd apps/api
NODE_ENV=production node src/index.js

# Test Web (in another terminal)
cd apps/web
npm start
```

## Monitoring

- Enable Render's monitoring in dashboard
- Check service logs regularly
- Set up uptime monitoring (e.g., UptimeRobot)

## Upgrading to Paid Plan

Benefits:
- Always-on services (no spin down)
- Better performance
- More compute resources
- Priority support

Cost: ~$7/month per service

## Alternative: Vercel + Render

Deploy Web on Vercel (free, optimized for Next.js):
- Faster cold starts
- Better Next.js optimization
- Deploy API on Render only

This hybrid approach can be more cost-effective.
