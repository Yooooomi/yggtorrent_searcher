#!/bin/bash

if [[ -z "$WEB_PORT" ]]
then
    echo "No WEB_PORT provided, using default 3000"
    export WEB_PORT="3000"
fi

echo "Client port: $WEB_PORT"

PORT="$WEB_PORT" npm start
