#!/bin/bash

# Function to check and install Python3
check_install_python() {
    if ! command -v python3 &> /dev/null
    then
        echo "Python3 could not be found, installing Python3..."
        sudo apt-get update
        sudo apt-get install -y python3
    else
        echo "Python3 is already installed."
    fi
}

# Function to check and install Ruby
check_install_ruby() {
    if ! command -v ruby &> /dev/null
    then
        echo "Ruby could not be found, installing Ruby..."
        sudo apt-get update
        sudo apt-get install -y ruby
    else
        echo "Ruby is already installed."
    fi
}

# Function to handle cleanup on exit
cleanup() {
    echo "Cleaning up..."
    kill -9 $BACKEND_PID $FRONTEND_PID
    exit 0
}

# Set trap to call cleanup on script exit
trap cleanup SIGINT SIGTERM

# Check and install Python3 and Ruby
check_install_python
check_install_ruby

# Start the backend server
java -jar APP/quarkus-app/quarkus-run.jar &
BACKEND_PID=$!

sleep 5

# Serve the frontend files
cd APP/VAILLANT
python3 -m http.server 1573 &
FRONTEND_PID=$!
cd -
# Wait for a few seconds to ensure the server is up and running
sleep 5

# Open the default web browser
xdg-open http://localhost:1573
# Inline Python script to monitor the web browser
python3 - <<EOF &
import time
import psutil
import webbrowser

url = "http://localhost:1573"

def is_browser_open(port):
    for proc in psutil.process_iter(['pid', 'name']):
        try:
            if 'firefox' in proc.info['name'] or 'chrome' in proc.info['name']:
                for conn in proc.connections(kind='inet'):
                    if conn.laddr.port == port:
                        return True
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    return False

#webbrowser.open(url)
while True:
    if not is_browser_open(1573):
        break
    time.sleep(2)

print("Browser closed, exiting...")
EOF
BROWSER_MONITOR_PID=$!

# Wait for the Python script to finish
wait $BROWSER_MONITOR_PID

# Cleanup servers when browser is closed
cleanup