# 🚀 Deployment Instructions - Socket.IO Sync Fix

**Status:** Code pushed to GitHub (commit `f8ef6b9`)  
**Current Container:** Running old version (started 4 hours ago)  
**Action Required:** Deploy new version with Socket.IO fixes

---

## ✅ Quick Deploy via Jenkins (RECOMMENDED)

**Paling mudah - Jenkins akan otomatis pull, build, dan deploy:**

1. **Buka Jenkins:**  
   http://192.168.1.60:8080/job/imtihan_display/

2. **Klik "Build Now"** di sidebar kiri

3. **Wait ~3 minutes** untuk build selesai

4. **Verify deployment:**  
   http://192.168.1.60:3010/operator
   
   **Expected:** Lihat badge hijau "CONNECTED" di navbar kanan atas

---

## 🔧 Manual Deploy via CT 104 Terminal

**Jika Jenkins tidak available atau mau deploy manual:**

### Step 1: SSH ke CT 104
```bash
ssh root@192.168.1.100
pct enter 104
```

### Step 2: Navigate ke workspace Jenkins
```bash
cd /var/jenkins_home/workspace/imtihan_display

# Atau kalau directory tidak ada, cari dulu:
find / -name "imtihan_display" -type d 2>/dev/null | grep -v node_modules
```

### Step 3: Pull latest code
```bash
git pull origin master
```

**Expected output:**
```
remote: Enumerating objects: 14, done.
Receiving objects: 100% (14/14), done.
Updating 9f98cdb..f8ef6b9
Fast-forward
 7 files changed, 703 insertions(+)
```

### Step 4: Rebuild & Restart Container
```bash
# Stop current container
docker compose -f docker-compose.prod.yml down

# Rebuild with new code
docker compose -f docker-compose.prod.yml up -d --build

# Check logs
docker logs imtihan-display --tail 30
```

**Expected logs:**
```
🚀 Socket.IO server running:
   - Local:   http://localhost:3001
   - Network: http://192.168.1.60:3001
✅ Full state sync enabled
✅ Reconnection support active

▲ Next.js 16.2.4
- Local:        http://localhost:3000
- Network:      http://0.0.0.0:3000

✓ Starting...
✓ Ready in 845ms
```

### Step 5: Verify
```bash
# Check container running
docker ps | grep imtihan

# Test Socket.IO endpoint
curl -I http://localhost:3011
# Should return: HTTP/1.1 400 Bad Request (normal)

# Test Next.js
curl -I http://localhost:3010
# Should return: HTTP/1.1 200 OK
```

---

## ✅ Post-Deployment Verification

### 1. Buka Operator Page
http://192.168.1.60:3010/operator

**Check:**
- ✅ Navbar kanan atas ada badge hijau "CONNECTED"
- ✅ Ada angka jumlah client connected (contoh: "1")
- ✅ Tidak ada error di browser console

### 2. Test Multi-Device Sync

**Buka 2 browser/device berbeda:**

**Device A (Operator):**  
http://192.168.1.60:3010/operator

**Device B (Display):**  
http://192.168.1.60:3010/display

**Test Steps:**
1. Di Device A: Klik nomor soal (contoh: 5)
2. **Expected:** Device B langsung show soal nomor 5
3. Di Device A: Klik "Show Answer"
4. **Expected:** Device B langsung show jawaban
5. **Check:** Connection status badge shows "2" clients

### 3. Test Reconnection

**On CT 104:**
```bash
# Restart container to simulate disconnect
docker restart imtihan-display
```

**On Browser:**
- Connection badge berubah: "CONNECTED" → "RECONNECTING" → "CONNECTED"
- State tetap preserved setelah reconnect
- No page refresh needed

---

## 🐛 Troubleshooting

### Issue: Badge shows "DISCONNECTED"

**Check 1: Container running?**
```bash
docker ps | grep imtihan-display
```

**Check 2: Socket.IO port accessible?**
```bash
curl http://192.168.1.60:3011
```

**Fix:** Klik "Retry" button pada badge atau refresh page

---

### Issue: Build failed di Jenkins

**Check logs:**
```
http://192.168.1.60:8080/job/imtihan_display/lastBuild/console
```

**Common issues:**
- Port conflict → Stop old container first
- Out of memory → Restart Jenkins
- Docker build timeout → Increase timeout di Jenkinsfile

**Fix:** Manual deploy via CT 104 (see above)

---

### Issue: State tidak sync antar device

**Check:** Browser console (F12 → Console tab)

**Expected logs:**
```
[Socket] Initializing connection to: http://192.168.1.60:3011
[Socket] ✅ Connected: AbCdEf123456
[Socket] 👥 Connected clients: 2
[Socket] 📥 State update received: {...}
```

**If missing:** Socket not connecting
**Fix:**
```bash
# Restart container
docker restart imtihan-display

# Or rebuild
cd /path/to/imtihan_display
docker compose -f docker-compose.prod.yml up -d --build --force-recreate
```

---

## 📊 What Changed?

### Before Deploy
- ❌ Socket.IO hardcoded port 3001 (wrong!)
- ❌ Partial state sync
- ❌ No reconnection
- ❌ No connection visibility

### After Deploy
- ✅ Socket.IO auto-detect port (3001 dev, 3011 prod)
- ✅ Full state sync (profiles, questions, settings)
- ✅ Auto-reconnection (max 10 attempts)
- ✅ Connection status indicator
- ✅ Client count monitoring
- ✅ Manual retry button

---

## 🎯 Expected Results

**After successful deployment:**

1. **Operator Page:**
   - Green "CONNECTED" badge in navbar
   - Client count shown (1+)
   - No console errors

2. **Multi-Device Sync:**
   - Changes propagate instantly (<100ms)
   - All devices show same state
   - No manual refresh needed

3. **Reconnection:**
   - Auto-reconnect on disconnect
   - State preserved
   - Visual feedback (Reconnecting → Connected)

4. **Browser Console:**
   ```
   [Socket] ✅ Connected: <id>
   [Socket] 👥 Connected clients: <count>
   ```

---

## 🚀 Deploy Now!

**Choose one method:**

### Option 1: Jenkins (Easy) ⭐
→ http://192.168.1.60:8080/job/imtihan_display/  
→ Click "Build Now"

### Option 2: Manual (CT 104)
```bash
ssh root@192.168.1.100
pct enter 104
cd /var/jenkins_home/workspace/imtihan_display
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

**Setelah deploy, test di:**  
http://192.168.1.60:3010/operator

**Look for green "CONNECTED" badge! 🟢**

---

**Questions? Check SOCKET_SYNC_FIX.md for complete documentation.**
