@echo off
echo ===================================================
echo   Starting Imtihan Display Sistem...
echo ===================================================
if not exist .env.local (
    echo [INFO] Copying .env.example to .env.local...
    copy .env.example .env.local
)
echo [INFO] Running development servers (Next.js + Socket.IO)...
npm run dev-full
pause
