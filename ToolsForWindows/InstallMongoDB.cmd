@echo off
echo Welcome to Main DevOps Platform

@powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin

choco install mongodb -y

setx path "%path%;%ProgramFiles%\MongoDB\Server\3.2\bin\"

reg.exe add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" /v "MongoDB_Server" /t REG_SZ /d "%ProgramFiles%\MongoDB\Server\3.2\bin\mongod.exe" /f

echo MongoDB installed and configured succesfuly.