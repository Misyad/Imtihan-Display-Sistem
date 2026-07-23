# Docker Deployment Guide - Imtihan Display

**Created:** 2026-07-04  
**Status:** ✅ Ready for deployment

---

## 🎯 Summary of Changes

Imtihan Display telah di-**Dockerize** untuk align dengan deployment pattern project lain (AiQuran, mpj_event, maziltutholiban).

### Files Created/Modified:

| File | Status | Purpose |
|------|--------|---------|
| `Dockerfile` | ✅ Created | Multi-stage build (Next.js + Socket.IO) |
| `docker-compose.prod.yml` | ✅ Created | Production orchestration |
| `Jenkinsfile` | ✅ Updated | Docker Compose pattern (was: direct node) |
| `next.config.ts` | ✅ Updated | Enable standalone output mode |
| `.env.example` | ✅ Created | Configuration reference |

**Git Commit:** `f04fdc5`  
**Pushed to:** `master` branch

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   Docker Container: imtihan-display │
├─────────────────────────────────────┤
│  ┌──────────────────┐               │
│  │ Next.js App      │  :3000 → 3005 │
│  └──────────────────┘               │
│  ┌──────────────────┐               │
│  │ Socket.IO Server │  :3001 → 3006 │
│  └──────────────────┘               │
└─────────────────────────────────────┘
```

**Ports:**
- **3005** → Next.js frontend
- **3006** → Socket.IO real-time server

---

## 🚀 Jenkins Pipeline (New)

### Old Pattern (❌ Broken):
```groovy
stage('Install Dependencies') {
    sh 'node --version'  // ❌ Needs Node.js in Jenkins
    sh 'npm ci'
}
```

### New Pattern (✅ Fixed):
```groovy
stage('Build & Deploy') {
    sh 'docker compose -f docker-compose.prod.yml up -d --build'
}
```

**Benefits:**
- ✅ No Node.js required in Jenkins agent
- ✅ Consistent with 3 other projects
- ✅ Isolated dependencies
- ✅ Production-ready deployment

---

## 📋 Manual Verification Steps

### 1. Trigger Jenkins Build

**Option A: Auto-trigger (if webhook configured)**
- Build should auto-start after git push ✅

**Option B: Manual trigger**
```
1. Open http://192.168.1.60:8080/job/imtihan_display/
2. Click "Build Now"
3. Monitor console output
```

### 2. Expected Jenkins Stages

```
✅ Checkout              - Git clone from GitHub
✅ Build & Deploy        - docker compose up -d --build
✅ Health Check          - Verify container running
✅ Cleanup               - Prune old images
```

### 3. Verify Deployment

**Check container status:**
```bash
ssh root@192.168.1.60
docker ps | grep imtihan-display
```

Expected output:
```
imtihan-display   Up X minutes   0.0.0.0:3005->3000/tcp, 0.0.0.0:3006->3001/tcp
```

**Check logs:**
```bash
docker logs imtihan-display --tail 50
```

Expected output:
```
🚀 Socket.IO server running:
   - Local:   http://localhost:3001
   - Network: http://172.x.x.x:3001
-------------------------------------------
```

**Access application:**
- Frontend: http://192.168.1.60:3005
- Socket.IO: http://192.168.1.60:3006

---

## 🔧 Local Development (unchanged)

```bash
npm install
npm run dev-full   # Runs Next.js + Socket.IO
```

---

## 🐛 Troubleshooting

### Build fails at "npm ci" stage?
**Cause:** Old Jenkinsfile cached  
**Fix:** Git pull in Jenkins workspace, or wipe workspace

### Container exits immediately?
**Cause:** Dockerfile CMD issue  
**Check logs:** `docker logs imtihan-display`

### Port conflicts (3005/3006 already used)?
**Fix:** Update `.env` or `docker-compose.prod.yml`:
```bash
APP_PORT=3007
SOCKET_PORT=3008
```

---

## 📊 Comparison with Other Projects

| Project | Pattern | Status |
|---------|---------|--------|
| AiQuran | Docker Compose | ✅ Working |
| maziltutholiban | Docker Compose | ✅ Working |
| mpj_event | Docker Compose | ✅ Working |
| **Imtihan Display** | Docker Compose | ✅ **NOW ALIGNED** |

---

## ✅ Next Steps

1. **Verify Jenkins build** at http://192.168.1.60:8080/job/imtihan_display/
2. **Test application** at http://192.168.1.60:3005
3. **Monitor logs** for any runtime issues
4. **Update DNS/reverse proxy** if needed (e.g., imtihan.projecthasan.com)

---

## 📝 Notes

- Container restart policy: `unless-stopped` (auto-restart on reboot)
- Network: Isolated bridge network `imtihan-network`
- Image name: `imtihan-display:latest`
- Build strategy: Multi-stage (optimized size)

