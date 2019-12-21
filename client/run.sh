#!/bin/bash

if [[ -z "$WEB_PORT" ]]
then
    echo "No WEB_PORT provided, using default 3000"
    export WEB_PORT=3000
    WEB_PORT=3000
fi

serve -l "0.0.0.0:$WEB_PORT" build/
