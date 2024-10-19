@echo off
set GOOS=windows
set GOARCH=amd64
go build -o BlogSystem.exe
echo Build completed!
PAUSE