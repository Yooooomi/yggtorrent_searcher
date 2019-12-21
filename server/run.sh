#!/bin/bash

if [[ -z "$SERVER_PORT" ]]
then
    echo "No SERVER_PORT provided, using default 8081"
    export SERVER_PORT="8081"
fi

echo "Server port: ${SERVER_PORT}"

npm start
