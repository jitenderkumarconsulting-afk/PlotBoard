# service-composer

this is the docker compose file that will mirror the services we will create on aws

Here is an example of a fairly diverse docker compose running different languages.

version: '3.2'
services:
db:
networks:
default:
aliases: - postgres.localhost
image: postgres:latest
environment: - POSTGRES_PASSWORD=password - POSTGRES_USERNAME=postgres
ports: - 5432:5432
volumes: - dbdata:/var/lib/postgresql/data
user: postgres
healthcheck:
test: ["CMD", "pg_isready"]
interval: 10s
timeout: 5s
retries: 5
restart: always
redis:
networks:
default:
aliases: - redis.localhost
image: redis:alpine
ports: - 6379:6379
sidekiq:
networks:
default:
aliases: - sidekiq.localhost
links: - ai:ai.localhost - redis - db
build:
context: ${PWD}/../plotboard/ # dockerfile: ${PWD}/../plotboard/Dockerfile
command: bundle exec sidekiq
volumes: - /app/plotboard/tmp # don't mount tmp directory
environment: - REDIS_URL=redis://redis.localhost:6379/1 - POSTGRES_PORT=5432 - POSTGRES_PASSWORD=password - POSTGRES_USERNAME=postgres - POSTGRES_HOST=postgres.localhost
web:
networks:
default:
aliases: - localhost
build:
context: ${PWD}/../plotboard/
dockerfile: ${PWD}/../plotboard/Dockerfile
ports: - 3000:3000
depends_on:
db:
condition: service_healthy
links: - redis - ai:ai.localhost - sidekiq
entrypoint: /app/docker-entrypoint.sh
environment: - POSTGRES_HOST=postgres.localhost - POSTGRES_PORT=5432 - REDIS_URL=redis://redis.localhost:6379/1 - PORT=3000 - POSTGRES_PASSWORD=password - POSTGRES_USERNAME=postgres - WWW_URL=http://localhost:3000 - SCRATCH_URL=http://localhost:8601 - AI_URL=ai.localhost:8000
volumes: - ${PWD}/../plotboard/:/app/
ai:
networks:
default:
aliases: - ai.localhost
build:
context: ${PWD}/../AICardGeneration/
dockerfile: ${PWD}/../AICardGeneration/Dockerfile
ports: - 8000:8000
environment: - REDIS_URL=redis://redis.localhost:6379 - PORT=8000
volumes: - ${PWD}/../AICardGeneration/:/app

scratch-gui:
build:
context: ${PWD}/../scratch-gui
dockerfile: ${PWD}/../scratch-gui/Dockerfile # command: npm run dev
networks:
default:
aliases: - localhost
volumes: - ${PWD}/../scratch-vm:/scratch-vm - ${PWD}/../scratch-gui:/scratch-gui # platform: linux/amd64
command: npm start
ports: - 8601:8601
environment: - DOCKER='true' - dev_assetHost=http://localhost:3000/scratch/games - dev_deckHost=http://localhost:3000/scratch - dev_assetHost=http://localhost:3000/scratch/assets - dev_cableHost=http://localhost:3000/cable
volumes:
dbdata:
networks:
default:
driver: bridge

# How to use it?

Before running `docker-compose up --build -d`, please make sure you have all the repository downloaded under one folder.

# Run service composer from terminal with given below command

docker-compose up --build -d

# fiew more docker commands are given below

# 1. view running docker and status

docker ps

# 2. view status for container id

docker ps container id

# 3. to inspect docker status/info

docker inspect container-name-that you-provided.

# 4. remove container and docker, usefull when to rebuid the docker compose again.

docker-compose -f docker-compose.yaml down -v
