@echo off
title BudaMahakal - Public Tunnel (Cloudflare)
color 0B

echo.
echo  ==========================================
echo   BudaMahakal - Public Internet Tunnel
echo   Powered by Cloudflare
echo  ==========================================
echo.
echo [INFO] Starting Cloudflare tunnel on port 3000...
echo [INFO] A public HTTPS URL will appear below.
echo [INFO] Share that URL with anyone to access your website!
echo.
echo  NOTE: Make sure the server is running first (start.bat)
echo.

cloudflared tunnel --url http://localhost:3000

pause
