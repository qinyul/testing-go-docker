#!/bin/sh

if [ $# -eq 0 ]; then 
    set -- "dev" 
fi

env=$1


runcDocker(){
    env=$1
    service=$2

    echo "Run Docker Compose For Development [$service]"
    docker-compose -f ./docker-compose.dev.yml -p  $service --env-file .env up -d --force-recreate --build
}

runcDocker $env "global"