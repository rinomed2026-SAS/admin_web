# RINOMED 2026 Admin Web

Panel administrativo web para RINOMED 2026.

Este repositorio incluye:

- `frontend` en la raíz con `Vite + React + TypeScript`
- `backend` en `services/api` con `Express + Prisma`
- `PostgreSQL` como base de datos del API

## Requisitos

- `Node.js` 20+
- `npm`
- `Docker Desktop` o una instancia local de `PostgreSQL`

## Estructura del proyecto

```text
.
├── src/                 # Frontend Vite + React
├── public/
└── services/
    └── api/             # Backend Express + Prisma
```

## Instalación

### Frontend

```bash
cd admin_web
npm install
```

### Backend

```bash
cd admin_web/services/api
npm install
```

## Base de datos

El backend espera una base de datos PostgreSQL en `localhost:5432` con estas credenciales:

```dotenv
DATABASE_URL=postgresql://rinomed:rinomed_password@localhost:5432/rinomed2026
```

### Opción A: usar Docker

Si no tienes PostgreSQL local, levántalo con Docker:

```bash
docker run -d \
  --name rinomed_postgres \
  -e POSTGRES_USER=rinomed \
  -e POSTGRES_PASSWORD=rinomed_password \
  -e POSTGRES_DB=rinomed2026 \
  -p 5432:5432 \
  postgres:16
```

Si el contenedor ya existe:

```bash
docker start rinomed_postgres
```

## Variables de entorno del backend

El API usa `services/api/.env`.

Si hace falta recrearlo:

```bash
cd admin_web/services/api
cp .env.example .env
```

Valores esperados:

```dotenv
PORT=4000
DATABASE_URL=postgresql://rinomed:rinomed_password@localhost:5432/rinomed2026
JWT_ACCESS_SECRET=change_me_access
JWT_REFRESH_SECRET=change_me_refresh
JWT_ACCESS_TTL_MINUTES=15
JWT_REFRESH_TTL_DAYS=30
CORS_ORIGIN=*
APP_URL=http://localhost:8100
```

## Preparar la base de datos

Con PostgreSQL arriba, ejecuta:

```bash
cd admin_web/services/api
npm run prisma:generate
npx prisma migrate deploy
npm run prisma:seed
```

Esto aplica migraciones y carga datos demo.

## Levantar todo el proyecto

Abre tres terminales.

### Terminal 1: PostgreSQL

```bash
docker start rinomed_postgres
```

Si no existe el contenedor, usa el comando `docker run` de la sección anterior.

### Terminal 2: backend

```bash
cd admin_web/services/api
npm run prisma:generate
npx prisma migrate deploy
npm run prisma:seed
npm run dev
```

Backend disponible en:

- `http://localhost:4000`
- `http://localhost:4000/v1/event-info`

### Terminal 3: frontend

```bash
cd admin_web
npm run dev
```

Frontend disponible en:

- `http://localhost:5173`

El frontend consume el backend en `http://localhost:4000` por defecto desde `src/api.ts`.

## Credenciales demo

El seed crea este usuario administrador:

- Email: `review@rinomed2026.com`
- Password: `Rinomed2026!`

## Verificación rápida

```bash
curl http://localhost:4000/v1/event-info
curl -I http://localhost:5173
```

## Scripts disponibles

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

```bash
cd services/api
npm run dev
npm run build
npm run start
npm run prisma:generate
npm run prisma:seed
```

## Notas

- Si `docker ps` falla, abre `Docker Desktop` antes de iniciar la base.
- Si cambias la URL del backend, define `VITE_API_BASE_URL` en el frontend.
- Para producción, cambia los secretos JWT del archivo `services/api/.env`.
