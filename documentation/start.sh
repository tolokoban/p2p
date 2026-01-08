#!/usr/bin/bash

http-server ./build/ -p 0 &

sleep 1
echo
echo "Open a browser with the local IP address (then press ENTER)"
echo
read
