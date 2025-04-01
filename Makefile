.PHONY: build up down restart logs ps clean help

# Default target
help:
	@echo "Available commands:"
	@echo "  make build     - Build all containers"
	@echo "  make up        - Start all containers in detached mode"
	@echo "  make down      - Stop and remove all containers"
	@echo "  make restart   - Restart all containers"
	@echo "  make logs      - View logs from all containers"
	@echo "  make ps        - List all running containers"
	@echo "  make clean     - Remove all containers, volumes, and images"

# Build all containers
build:
	docker-compose build

# Start all containers in detached mode
up:
	docker-compose up -d

# Start all containers in attached mode with logs
up-logs:
	docker-compose up

# Stop and remove all containers
down:
	docker-compose down

# Restart all containers
restart:
	docker-compose restart

# View logs from all containers
logs:
	docker-compose logs -f

# List all running containers
ps:
	docker-compose ps

# Remove all containers, volumes, and images
clean:
	docker-compose down -v
	docker system prune -af --volumes