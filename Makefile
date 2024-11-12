dev:
	npm run start:dev

test:
	npm run test
	npm run test:e2e
	npm run test:cov

build:
	npm run build


run_postgre:
	docker run --name postgres-instance-marti \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=marti_case_database \
  -p 5432:5432 \
  -d postgis/postgis

restart_postgre:
	docker stop postgres-instance-marti
	docker rm postgres-instance-marti
	make run_postgre

run_redis:
	docker run --name redis-instance-marti -p 6379:6379 -d redis

restart_redis:
	docker stop redis-instance-marti
	docker rm redis-instance-marti
	make run_redis