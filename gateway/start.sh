#!/bin/sh

if [ $# -eq 0 ]; then
    set -- "dev"
fi

echo "Run Docker Compose For Development"
docker-compose -f ./docker-compose.dev.yml --env-file .env up -d --force-recreate --build