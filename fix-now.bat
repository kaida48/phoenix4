REM filepath: c:\Users\Wertz\Documents\Phoenix4\phoenix-roleplay\fix-now.bat
@echo off
echo Phoenix Roleplay Fix Utility
echo ===========================
echo.
echo This script will fix common issues with your Phoenix Roleplay setup.
echo.

echo Fixing package.json...
copy /y "%~dp0\fixed-package.json" "%~dp0\package.json" > nul
if %errorlevel% neq 0 (
  echo Could not copy fixed package.json. Using alternative method...
  call fix-package.bat
) else (
  echo Package.json successfully fixed!
)

echo.
echo Installing required packages...
call npm install

echo.
echo Installing TSX globally...
call npm install -g tsx

echo.
echo Installing TSX locally...
call npm install tsx --save-dev

echo.
echo Fix completed! You should now be able to run:
echo npm run test:db
echo npm run create:admin
echo npm run seed:db
echo.
pause