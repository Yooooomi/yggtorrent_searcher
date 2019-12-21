#!/bin/bash

if [[ -z "$SERVER_PORT" ]]
then
    echo "No WEB_PORT provided, using default 8081"
    export SERVER_PORT=8081
    SERVER_PORT=8081
fi

npm start
