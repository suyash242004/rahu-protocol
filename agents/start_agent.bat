@echo off
echo ========================================
echo   RAHU PROTOCOL - AI Agent Startup
echo ========================================
echo.
echo Starting AI Agent with HTTP API...
echo.

cd /d "%~dp0"
python scripts/start_agent.py

pause
