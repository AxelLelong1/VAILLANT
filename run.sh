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

# Check and install Python3 and Ruby
check_install_python
check_install_ruby

# Start the backend server
java -jar APP/quarkus-app/quarkus-run.jar

# Serve the frontend files
cd APP/VAILLANT
python3 -m http.server 1573

# Wait for a few seconds to ensure the server is up and running
sleep 5

# Open the default web browser
xdg-open http://localhost:1573
