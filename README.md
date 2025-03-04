# Nest-auth

## Для запуска

### production

1. В /docker создать .env.prod

```
COMPOSE_PROJECT_NAME=prod_homework1
NODE_ENV=production
APP_PORT=3000
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=homework1
JWT_ACCESS_SECRET=yoursecret
JWT_REFRESH_SECRET=yoursecret
REFRESH_EXPIRED_IN=7d
ACCESS_EXPIRED_IN=10s
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/homework1?schema=public
```

2. Запустить docker build - `docker:prod:build`
3. Запустить docker compose - `pnpm docker:prod:run`

localhost:${APP_PORT}/api - равзернутое приложение

localhost:${APP_PORT}/swagger - Swagger Documentation

### development

1. В /docker создать .env.dev

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=homework1
```

2. В /prisma создать .env

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5431/homework1?schema=public"
```

3. В /env создать .env.development

```
NODE_ENV=development
APP_PORT=4000
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=homework1
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
REFRESH_EXPIRED_IN=7d
ACCESS_EXPIRED_IN=10s
```

4. Сгенерировать prisma client
   `prisma generate`

5. Запускаем docker compose -

```
pnpm docker:dev:build
pnpm docker:dev:run
```

6. Запускаем миграции

```
pnpm migrate:dev
```

localhost:${APP_PORT}/api - запущенное приложение

localhost:${APP_PORT}/swagger - Swagger Documentation
