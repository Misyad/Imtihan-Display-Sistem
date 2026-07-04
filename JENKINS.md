# Jenkins CI/CD Setup Guide

**Last Updated:** 2026-07-04  
**For:** Imtihan Display Sistem

---

## 📋 Overview

Jenkinsfile telah dibuat untuk automated CI/CD pipeline.

---

## 🔄 Pipeline Stages

### 1. Checkout
- Clone repository dari GitHub
- Checkout branch yang di-trigger

### 2. Install Dependencies
- Install Node.js dependencies dengan `npm ci`
- Verify Node.js version

### 3. Lint
- Run ESLint untuk code quality check
- Fail jika ada linting errors

### 4. Type Check
- Run TypeScript compiler untuk type checking
- Ensure no type errors

### 5. Build
- Build Next.js application
- Generate production bundle

### 6. Test
- Run automated tests
- *Currently skipped - belum ada tests*

### 7. Security Scan
- Run npm audit untuk vulnerability check
- Alert jika ada security issues

### 8. Archive Artifacts
- Archive build artifacts (.next folder)
- Store untuk deployment

### 9. Deploy to Staging (develop branch only)
- Auto-deploy ke staging environment
- *Placeholder - perlu dikonfigurasi*

### 10. Deploy to Production (master branch only)
- Auto-deploy ke production
- *Placeholder - perlu dikonfigurasi*

---

## 🛠️ Jenkins Configuration

### Prerequisites

**Jenkins Plugins Required:**
- NodeJS Plugin
- Pipeline Plugin
- GitHub Plugin
- Git Plugin

**Install plugins:**
```bash
# Jenkins CLI
java -jar jenkins-cli.jar install-plugin nodejs
java -jar jenkins-cli.jar install-plugin workflow-aggregator
java -jar jenkins-cli.jar install-plugin github
```

### Configure Node.js in Jenkins

1. Go to: `Manage Jenkins` → `Global Tool Configuration`
2. Add NodeJS installation:
   - Name: `Node 20.x`
   - Version: `20.x`
   - Install automatically: ✅

### Create Pipeline Job

1. **New Item** → **Pipeline**
2. **Name:** `Imtihan-Display-Sistem`
3. **Pipeline Definition:** Pipeline script from SCM
4. **SCM:** Git
5. **Repository URL:** `https://github.com/Misyad/Imtihan-Display-Sistem.git`
6. **Credentials:** Add GitHub credentials
7. **Branch Specifier:** `*/master` (or `*/develop` for staging)
8. **Script Path:** `Jenkinsfile`

---

## 🔐 Environment Variables

Add these to Jenkins credentials:

### Required Secrets:
```bash
# Database
DATABASE_URL

# NextAuth
NEXTAUTH_SECRET
NEXTAUTH_URL

# Deployment (if using Vercel/Railway)
VERCEL_TOKEN
RAILWAY_TOKEN
```

**Add in Jenkins:**
1. `Manage Jenkins` → `Manage Credentials`
2. Add credentials (Secret text)
3. Use credential IDs in Jenkinsfile

---

## 🚀 Deployment Configuration

### Option 1: Vercel Deployment

Update Jenkinsfile `Deploy to Production` stage:

```groovy
stage('Deploy to Production') {
    when {
        branch 'master'
    }
    steps {
        withCredentials([string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN')]) {
            sh '''
                npm install -g vercel
                vercel --token=$VERCEL_TOKEN --prod --yes
            '''
        }
    }
}
```

### Option 2: VPS Deployment via SSH

```groovy
stage('Deploy to Production') {
    when {
        branch 'master'
    }
    steps {
        sshagent(['vps-ssh-key']) {
            sh '''
                ssh user@your-server.com "cd /var/www/imtihan && \
                    git pull origin master && \
                    npm install && \
                    npm run build && \
                    pm2 restart imtihan"
            '''
        }
    }
}
```

### Option 3: Railway Deployment

```groovy
stage('Deploy to Production') {
    when {
        branch 'master'
    }
    steps {
        withCredentials([string(credentialsId: 'railway-token', variable: 'RAILWAY_TOKEN')]) {
            sh '''
                npm install -g @railway/cli
                railway up --token=$RAILWAY_TOKEN
            '''
        }
    }
}
```

---

## 🔔 Notifications

### Slack Notification (Optional)

Add to Jenkinsfile `post` section:

```groovy
post {
    success {
        slackSend(
            color: 'good',
            message: "✅ Build SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
        )
    }
    failure {
        slackSend(
            color: 'danger',
            message: "❌ Build FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
        )
    }
}
```

**Setup:**
1. Install Slack Notification Plugin
2. Configure Slack workspace in Jenkins
3. Add webhook URL

---

## 📊 Monitoring

### Build Status Badge

Add to README.md:

```markdown
[![Build Status](http://your-jenkins-server/buildStatus/icon?job=Imtihan-Display-Sistem)](http://your-jenkins-server/job/Imtihan-Display-Sistem/)
```

---

## 🐛 Troubleshooting

### Issue: "npm: command not found"

**Solution:**
```groovy
tools {
    nodejs "Node 20.x"
}
```

Add at top of pipeline block.

### Issue: "Permission denied"

**Solution:**
```bash
# In Jenkins server
chmod +x node_modules/.bin/*
```

Or in Jenkinsfile:
```groovy
sh 'chmod +x node_modules/.bin/*'
```

### Issue: "Build fails on Windows agents"

**Solution:**
Convert shell commands to bat:
```groovy
steps {
    bat 'npm ci'
    bat 'npm run build'
}
```

Or use PowerShell:
```groovy
steps {
    powershell 'npm ci'
    powershell 'npm run build'
}
```

---

## ✅ Testing Pipeline

### Manual Trigger:
1. Go to Jenkins job
2. Click "Build Now"
3. Check Console Output

### Webhook Trigger (Recommended):

**GitHub Webhook:**
1. Go to GitHub repo → Settings → Webhooks
2. Add webhook:
   - URL: `http://your-jenkins-server/github-webhook/`
   - Content type: `application/json`
   - Events: Push, Pull Request
3. Save

**Jenkins Configuration:**
1. Job → Configure
2. Build Triggers → ✅ GitHub hook trigger for GITScm polling

---

## 📈 Next Steps

### After Pipeline Setup:

1. ✅ Test pipeline manually
2. ✅ Configure webhooks
3. ✅ Add deployment credentials
4. ✅ Setup notifications
5. ✅ Add tests (when available)
6. ✅ Configure staging/production branches

### Future Enhancements:

- [ ] Add unit tests stage
- [ ] Add E2E tests stage
- [ ] Add code coverage reporting
- [ ] Add Docker build stage
- [ ] Add performance testing
- [ ] Add security scanning (SAST/DAST)

---

## 📞 Support

**Issues with Jenkins:**
- Check Console Output in build
- Review Jenkinsfile syntax
- Verify credentials configured
- Check Node.js installation

**Build Failures:**
- Lint errors: Run `npm run lint` locally
- Type errors: Run `npx tsc --noEmit`
- Build errors: Run `npm run build` locally

---

**Jenkins Setup:** ✅ COMPLETE  
**Jenkinsfile:** ✅ CREATED  
**Next:** Configure Jenkins job and add credentials
