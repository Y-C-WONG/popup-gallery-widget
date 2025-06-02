@echo off
echo ====================================
echo   🚀 Gallery Widget Server Launcher
echo ====================================
echo.
echo Starting HTTP server for Gallery Widget...
echo Server will run on: http://localhost:8000
echo.
echo Available pages:
echo  • Modern Gallery: http://localhost:8000/modern-example.html
echo  • Comparison Tool: http://localhost:8000/comparison.html
echo  • Original Gallery: http://localhost:8000/example.html
echo  • Testing Console: http://localhost:8000/test-console.html
echo.
echo Press Ctrl+C to stop the server
echo ====================================
echo.

cd /d "%~dp0"
python -m http.server 8000

echo.
echo Server stopped. Press any key to exit...
pause > nul
