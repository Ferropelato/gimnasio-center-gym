@echo off
echo ========================================
echo Deploy a Firebase Hosting
echo ========================================
echo.
echo Paso 1: Iniciando sesion en Firebase...
npx firebase-tools login
echo.
echo Paso 2: Seleccionando proyecto...
npx firebase-tools use center-gym-yacanto
echo.
echo Paso 3: Desplegando a Firebase Hosting...
npx firebase-tools deploy --only hosting
echo.
echo ========================================
echo Deploy completado!
echo ========================================
pause
