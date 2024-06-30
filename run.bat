@echo off

REM Function to check and install Python
:check_install_python
where python >nul 2>nul
IF ERRORLEVEL 1 (
    echo Python could not be found, installing Python...
    bitsadmin.exe /transfer "DownloadPython" https://www.python.org/ftp/python/3.10.3/python-3.10.3-amd64.exe %TEMP%\python-installer.exe
    start /wait %TEMP%\python-installer.exe
) ELSE (
    echo Python is already installed.
)

REM Function to check and install Ruby
:check_install_ruby
where ruby >nul 2>nul
IF ERRORLEVEL 1 (
    echo Ruby could not be found, installing Ruby with BitAdmin...
    bitsadmin.exe /transfer "DownloadRuby" https://github.com/oneclick/rubyinstaller2/releases/download/RubyInstaller-3.3.3-1/rubyinstaller-3.3.3-1-x64.exe %TEMP%\rubyinstaller.exe
    start /wait %TEMP%\rubyinstaller.exe
) ELSE (
    echo Ruby is already installed.
)

REM Start the backend server
start java -jar APP/quarkus-app/quarkus-run.jar

REM Serve the frontend files
cd APP/VAILLANT
start python -m http.server 1573

REM Wait for a few seconds to ensure the server is up and running
timeout /t 5 /nobreak

REM Open the default web browser
start http://localhost:1573
