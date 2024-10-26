@echo off
REM 设置目标平台为 macOS
set GOOS=darwin
set GOARCH=amd64

REM 编译项目并输出为 BlogSystem_mac
go build -o BlogSystem_mac

REM 打印编译完成信息
echo MacOS 可执行文件编译完成: myapp_mac
pause
