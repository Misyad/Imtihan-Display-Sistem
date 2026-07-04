# 🚀 Deployment Guide

**Production deployment checklist and instructions**

---

## ⚠️ Pre-Deployment Checklist

### Security
- [ ] All secrets in environment variables (not in code)
- [ ] CORS configured (no wildcard *)
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Authentication working
- [ ] HTTPS enabled
- [ ] Security headers configured

### Database
- [ ] Database backed up
- [ ] Migrations tested
- [ ] Indexes created
- [ ] Connection pooling configured

### Testing
- [ ] All critical bugs fixed
- [ ] Manual testing passed
- [ ] Cross-browser tested
- [ ] Mobile tested
- [ ] Load tested (basic)

### Monitoring
- [ ] Sentry configured
- [ ] Uptime monitoring setup
- [ ] Error alerts working
- [ ] Health check endpoint created

### Documentation
- [ ] User guide complete
- [ ] API documentation ready
- [ ] Deployment steps documented
- [ ] Rollback procedure documented

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended for Next.js)

**Pros:**
- Zero config deployment
- Automatic HTTPS
- Edge network (fast)
- Free tier available
- CI/CD built-in

**Steps:**

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Configure Environment Variables**
```bash
# Add all env vars from .env.local to Vercel
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add ALLOWED_ORIGINS
```

4. **Deploy**
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

5. **Configure Domain**
- Go to Vercel dashboard
- Add custom domain
- Update NEXTAUTH_URL

**Socket.IO Server:**
Vercel doesn't support WebSockets natively. Deploy server.js separately:

```bash
# Deploy to Railway/Render
# See Option 2 below for server.js
```

---

### Option 2: Railway (For server.js)

**Steps:**

1. Create `railway.json`
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server.js",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

2. Deploy
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add environment variables
railway variables set PORT=3001
railway variables set ALLOWED_ORIGINS=https://yourdomain.com

# Deploy
railway up
```

3. Get deployment URL
```bash
railway domain
```

4. Update frontend to use Railway URL
```env
NEXT_PUBLIC_SOCKET_URL=https://your-app.railway.app
```

---

### Option 3: VPS (Full Control)

**Recommended for:** Complete control, custom setup

**Requirements:**
- Ubuntu 22.04 LTS
- 2GB RAM minimum
- Node.js 20+
- PostgreSQL 15+
- Nginx
- PM2

**Setup:**

```bash
# 1. Install dependencies
sudo apt update
sudo apt install nodejs npm postgresql nginx certbot

# 2. Clone repository
git clone https://github.com/yourusername/imtihan-display-sistem.git
cd imtihan-display-sistem

# 3. Install packages
npm install

# 4. Setup environment variables
cp .env.example .env.local
nano .env.local
# Fill in all values

# 5. Build Next.js
npm run build

# 6. Install PM2
npm install -g pm2

# 7. Start applications
pm2 start npm --name "nextjs" -- start
pm2 start server.js --name "socket-server"
pm2 save
pm2 startup

# 8. Configure Nginx
sudo nano /etc/nginx/sites-available/imtihan
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/imtihan /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL
sudo certbot --nginx -d yourdomain.com
```

---

## 🗄️ Database Setup (Production)

### Supabase (Recommended)

1. Go to https://supabase.com
2. Create project (use production tier)
3. Enable connection pooling
4. Copy connection string
5. Add to environment variables
6. Run migrations:

```bash
DATABASE_URL=your-supabase-url npx drizzle-kit push:pg
```

7. Enable automated backups (Supabase dashboard)

---

## 🔄 CI/CD Pipeline

Create `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Build
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📊 Post-Deployment

### 1. Smoke Testing (30 min)

- [ ] Visit production URL
- [ ] Login with admin credentials
- [ ] Create test profile
- [ ] Import test questions
- [ ] Test operator → display sync
- [ ] Test remote control
- [ ] Test all display modes
- [ ] Verify monitoring working
- [ ] Check error logging

### 2. Performance Check

```bash
# Run Lighthouse
npx lighthouse https://yourdomain.com --view

# Check response times
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com
```

### 3. Monitor First 24 Hours

- [ ] Check Sentry for errors
- [ ] Monitor uptime
- [ ] Check database connections
- [ ] Monitor response times
- [ ] Review user feedback

---

## 🔙 Rollback Procedure

**If critical issues occur:**

```bash
# Vercel - Rollback to previous deployment
vercel rollback

# Railway - Rollback
railway rollback

# VPS - Switch to previous version
pm2 stop all
git checkout previous-tag
npm install
npm run build
pm2 restart all
```

**Database rollback:**

```bash
# Restore from backup
pg_restore -d imtihan backup.sql
```

---

## 📞 Support & Monitoring

### Monitoring Stack
- **Errors:** Sentry (https://sentry.io)
- **Uptime:** UptimeRobot (https://uptimerobot.com)
- **Analytics:** Vercel Analytics
- **Database:** Supabase Dashboard

### Alert Configuration

**Sentry Alerts:**
- Error rate > 1%
- New error type
- Performance degradation

**Uptime Alerts:**
- Downtime > 5 minutes
- Response time > 5 seconds

### Escalation

**Critical Issues (P0):**
- Production down
- Data loss
- Security breach
**Response:** Immediate (< 15 min)

**High Issues (P1):**
- Feature broken
- Major bug
**Response:** < 2 hours

**Medium Issues (P2):**
- Minor bug
- Performance issue
**Response:** < 24 hours

---

## 🔐 Security Hardening

### SSL/HTTPS
```bash
# Verify SSL
curl -vI https://yourdomain.com 2>&1 | grep -i 'SSL\|TLS'
```

### Security Headers
Check: https://securityheaders.com/

Should have:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- Permissions-Policy

### Database Security
- [ ] Strong password (20+ chars)
- [ ] Connection from trusted IPs only
- [ ] SSL connection required
- [ ] Regular backups enabled

---

## 📈 Scaling Considerations

**When to scale:**
- > 10 concurrent users
- > 100 requests/minute
- Response time > 1 second

**Vertical Scaling:**
- Upgrade Vercel plan
- Upgrade Supabase tier
- More RAM/CPU on VPS

**Horizontal Scaling:**
- Multiple Socket.IO instances (sticky sessions)
- Database read replicas
- CDN for static assets
- Load balancer

---

## ✅ Production Checklist

- [ ] Domain configured with SSL
- [ ] Environment variables set
- [ ] Database backed up
- [ ] Monitoring configured
- [ ] Errors tracked in Sentry
- [ ] Uptime monitoring active
- [ ] Health check endpoint working
- [ ] Smoke tests passed
- [ ] Documentation complete
- [ ] Support contacts shared
- [ ] Rollback tested
- [ ] Team trained
- [ ] Announcement sent

---

**Deployment Date:** _____________  
**Deployed By:** _____________  
**Production URL:** _____________  
**Next Review:** _____________
