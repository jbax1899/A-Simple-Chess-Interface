@echo off
cd /d "%~dp0"
echo Starting Python HTTP Server on port 8000...
python -m http.server 80
pause