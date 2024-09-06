#!/bin/sh

if [ $# -eq 0 ]; then
    set -- "dev"
fi

echo "Run Auth Docker Compose for Development"

# docker-compose -f ./docker-compose.dev.yml --env-file .env build --no-cache
docker-compose -f ./docker-compose.dev.yml --env-file .env up -d --force-recreate --build --remove-orphans 