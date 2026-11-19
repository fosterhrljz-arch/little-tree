@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Little Tree needs Node.js 22.12 or newer. Install Node.js LTS, then try again.
  pause
  exit /b 1
)
node scripts\launch.mjs %*
if errorlevel 1 pause
