.PHONY: dev build

dev:
	docker compose up

build:
	docker compose run --rm hugo --minify