@echo off
title Duesenjet-Spiel online stellen
rem Node.js direkt erreichbar machen, auch wenn Windows die PATH-Aenderung noch nicht uebernommen hat.
set "PATH=%ProgramFiles%\nodejs;%PATH%"
cd /d "%~dp0"
echo.
echo Schritt 1 von 3: Spiel-Dateien werden vorbereitet ...
call npm install
if errorlevel 1 goto fehler

echo.
echo Schritt 2 von 3: Bitte melde dich im Browser bei Netlify an ...
call npx --yes netlify-cli@latest login
if errorlevel 1 goto fehler

echo.
echo Schritt 3 von 3: Das Spiel wird veroeffentlicht ...
call npx --yes netlify-cli@latest deploy --prod
if errorlevel 1 goto fehler

echo.
echo FERTIG! Die Internet-Adresse steht oben im Fenster.
pause
exit /b 0

:fehler
echo.
echo Es gab einen Fehler. Mache bitte ein Foto von diesem Fenster und schicke es mir.
pause
