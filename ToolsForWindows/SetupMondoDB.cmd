@echo off
echo Welcome to Main DevOps Platform

setx path "%path%;%ProgramFiles%\MongoDB\Server\3.2\bin\"

reg.exe add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Run" /v "MongoDB_Server" /t REG_SZ /d "%ProgramFiles%\MongoDB\Server\3.2\bin\mongod.exe" /f

echo MongoDB configured succesfuly.