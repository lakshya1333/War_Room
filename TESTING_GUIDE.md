# 🎮 Testing Guide - War Room V4.0

## Quick Feature Testing Checklist

### ✅ Pre-Flight Check
- [ ] Docker Desktop is running
- [ ] Gemini API key is set in `apps/api/.env`
- [ ] Run `pnpm install` completed
- [ ] Port 3000 and 3001 are available

### 🚀 Launch
```bash
cd war-room
pnpm start
```
Wait for: `✓ Ready on http://localhost:3000`

---

## 🎨 Feature Testing Guide

### 1. Matrix Rain Background ⭐
**Where to see it:**
- Open http://localhost:3000
- Should see falling green code immediately
- Background is always present

**What to verify:**
- ✓ Green neon characters falling
- ✓ Fade trail effect
- ✓ Smooth 60 FPS animation
- ✓ Japanese katakana + Latin chars
- ✓ Covers full screen

---

### 2. Sound Effects 🔊
**How to test:**
1. Open app
2. Look for speaker icon in header (top right)
3. Should be unmuted by default
4. Enter any URL and click "LAUNCH RECON"

**Sounds you should hear:**
- ✓ Scan start beep (low tone)
- ✓ Vulnerability found alert (medium beep)
- ✓ Critical alerts (loud alarm - repeating)
- ✓ Typing sounds (subtle clicks)

**Toggle test:**
- Click speaker icon to mute
- Click again to unmute

---

### 3. Glitch Effects ⚡
**Where to see it:**
- Start any scan
- Watch vulnerability names as they appear
- Hover over vulnerability titles

**What to verify:**
- ✓ Text glitches on first appearance
- ✓ Characters scramble briefly
- ✓ Critical vulnerabilities glitch more
- ✓ Glitch on hover

**Try this:**
- Enter: `https://github.com/OWASP/NodeGoat`
- Wait for vulnerabilities
- Hover over each one

---

### 4. Pulsing Alerts 🚨
**How to trigger:**
- Scan a repo with vulnerabilities
- Critical/High severity will trigger alerts

**What to verify:**
- ✓ Alert appears top-right
- ✓ Pulsing animation
- ✓ Red glow for critical
- ✓ Orange for high
- ✓ Sound plays with alert
- ✓ Auto-dismiss after 5s (except critical)
- ✓ Click X to dismiss

**Test repo:**
```
https://github.com/davevs/Vulnerable-Web-Application
```

---

### 5. 3D Network Topology 🌐
**How to enable:**
1. Start a scan (any URL/repo)
2. Wait for vulnerabilities to appear
3. Click "3D VIEW" button in header
4. Full-screen 3D visualization opens

**Controls:**
- **Left click + drag**: Rotate
- **Right click + drag**: Pan
- **Scroll**: Zoom in/out
- **Auto-rotate**: Enabled by default

**What to verify:**
- ✓ Nodes appear as colored spheres
- ✓ Lines connect parent-child nodes
- ✓ Particles flow along lines
- ✓ Hover node shows tooltip
- ✓ Click node shows details at bottom
- ✓ Color matches severity
  - Red = Critical
  - Orange = High
  - Yellow = Medium
  - Blue = Low

**Best test:**
```
https://github.com/user/repo-with-multiple-vulns
```

---

### 6. VR Mode 🥽
**Prerequisites:**
- VR headset connected (Quest, Vive, etc.)
- Browser supports WebXR

**How to test:**
1. Enable 3D view first
2. Click "ENABLE VR" button
3. Put on headset
4. Use controllers to interact

**What to verify:**
- ✓ VR mode activates
- ✓ Stereoscopic rendering
- ✓ Hand tracking (if supported)
- ✓ Controller interaction
- ✓ 90 FPS smooth rendering

**Note:** If no VR headset, button will show but may not activate

---

### 7. Typewriter Effect ⌨️
**Where to see it:**
- Look at thinking steps panel
- Text appears character-by-character
- Cursor blinks at end

**What to verify:**
- ✓ Text types out gradually
- ✓ Typing sounds play (if unmuted)
- ✓ Blinking cursor
- ✓ Natural typing speed

---

### 8. Gemini 2.0 Flash Thinking 🧠
**How to test:**
1. Start any scan
2. Watch "Gemini Thinking" panel
3. Steps appear in real-time

**What to verify:**
- ✓ Panel shows "Gemini Thinking Mode"
- ✓ Steps stream as AI thinks
- ✓ Each step numbered
- ✓ Timestamps shown
- ✓ Reasoning is detailed
- ✓ Technical and specific

**Check model name:**
- Footer should say: "GEMINI_2.0_FLASH_THINKING_EXP"

---

### 9. Code Fixes (Repository Analysis) 🔧
**How to test:**
1. Enter a GitHub repo URL
2. Click "LAUNCH RECON"
3. Wait for scan to complete
4. Look for "AI-Generated Security Fixes" panel

**Test repos:**
```
https://github.com/OWASP/NodeGoat
https://github.com/WebGoat/WebGoat
```

**What to verify:**
- ✓ Panel appears after vulnerabilities found
- ✓ Shows number of fixes
- ✓ Side-by-side code comparison
  - Left: Vulnerable code (red)
  - Right: Secure code (green)
- ✓ Explanation text present
- ✓ File tabs to switch between fixes
- ✓ Copy buttons work
- ✓ "Download Patch" button works

**Test copy:**
1. Click copy on vulnerable code
2. Paste in text editor
3. Click copy on secure code
4. Verify correct code copied

**Test patch download:**
1. Click "Download Patch"
2. Check Downloads folder
3. Open .patch file
4. Verify unified diff format

---

### 10. Attack Tree Visualization 🌳
**What to verify:**
- ✓ Nodes appear in real-time
- ✓ Severity colors correct
- ✓ Icons match severity
- ✓ Expand/collapse works
- ✓ Code snippets show
- ✓ File paths displayed
- ✓ CVE IDs present (if applicable)
- ✓ Remediation steps included

---

## 🎯 Complete Test Scenario

### Scenario 1: Simple URL Scan
```
1. Open http://localhost:3000
2. Verify Matrix rain visible
3. Enter URL: https://example.com
4. Click "LAUNCH RECON"
5. Listen for scan start sound
6. Watch vulnerabilities appear with glitch
7. Enable 3D view
8. Rotate and explore
9. Click a node
10. Read details
```

### Scenario 2: GitHub Repository Deep Scan
```
1. Open http://localhost:3000
2. Enable sound (if muted)
3. Enter repo: https://github.com/OWASP/NodeGoat
4. Click "LAUNCH RECON"
5. Watch Gemini thinking steps
6. Wait for vulnerabilities
7. Note glitch effects on critical vulns
8. Check for pulsing alerts
9. Scroll to "Code Fixes" section
10. Review side-by-side diffs
11. Download a patch file
12. Enable 3D view
13. Explore network topology
14. Try VR mode (if available)
```

### Scenario 3: Image + URL Analysis
```
1. Open app
2. Enter URL
3. Click "Upload Image"
4. Select screenshot
5. Click "LAUNCH RECON"
6. Gemini uses both contexts
7. More accurate results
```

---

## 🐛 Common Issues & Fixes

### Matrix rain not showing
- Check browser console for errors
- Verify Canvas API supported
- Refresh page

### No sound
- Check speaker icon (top right)
- Verify browser allows audio
- User interaction required first

### 3D view blank
- Check WebGL support: `chrome://gpu`
- Update graphics drivers
- Try different browser

### VR mode not working
- Verify headset connected
- Check WebXR support
- Use Chrome or Edge

### Code fixes not appearing
- Verify GitHub repo URL
- Wait for full scan completion
- Check for actual vulnerabilities

### Gemini errors
- Verify API key in `.env`
- Check API quota limits
- Restart API server

---

## 📊 Performance Benchmarks

### Expected Timings
- **Matrix rain**: Instant (0ms)
- **Sound effects**: <10ms delay
- **Glitch animation**: 500-1000ms
- **3D render**: <1s initial
- **VR mode**: <2s activation
- **Scan complete**: 10-30s
- **Code fixes**: +5-10s

### FPS Targets
- Matrix rain: 60 FPS
- 3D topology: 60 FPS
- VR mode: 90 FPS

---

## ✅ Final Checklist

### Visual Effects
- [ ] Matrix rain background
- [ ] Glitch text on vulnerabilities
- [ ] Pulsing alerts for critical
- [ ] 3D network topology
- [ ] VR mode (if headset available)
- [ ] Typewriter effect

### Audio
- [ ] Scan start sound
- [ ] Vulnerability found beep
- [ ] Critical alert alarm
- [ ] Typing sounds
- [ ] Mute/unmute toggle

### AI Features
- [ ] Gemini 2.0 Flash Thinking
- [ ] Real-time thinking steps
- [ ] Attack tree generation
- [ ] Exploit generation
- [ ] Code fix generation

### Functionality
- [ ] URL scanning
- [ ] GitHub repo analysis
- [ ] Image upload
- [ ] Docker exploit execution
- [ ] Report download
- [ ] 3D interaction
- [ ] Code diff viewing

---

## 🎥 Recording Demo

### Recommended Recording Settings
- **Resolution**: 1920x1080
- **FPS**: 60
- **Audio**: Enabled
- **Browser**: Chrome (best WebGL)

### Demo Script (2 minutes)
```
0:00 - Show Matrix rain
0:10 - Toggle sound icon
0:15 - Enter GitHub repo
0:20 - Click Launch Recon
0:25 - Point out glitch effects
0:35 - Show thinking steps
0:50 - Vulnerability appears with alert
1:00 - Enable 3D view
1:15 - Rotate and explore
1:30 - Click node for details
1:40 - Show code fixes panel
1:50 - Enable VR mode
2:00 - Conclusion
```

---

## 📞 Support

If something doesn't work:
1. Check this guide first
2. Verify Docker is running
3. Check browser console
4. Restart servers
5. Clear browser cache

**Happy Testing!** 🚀
