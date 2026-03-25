# 🚀 Simpay API

![CI](https://github.com/p3drosantos/simpay/actions/workflows/main.yml/badge.svg)
![Node](https://img.shields.io/badge/node-22-green)
![TypeScript](https://img.shields.io/badge/typescript-blue)
![Postgres](https://img.shields.io/badge/postgres-neon-blue)
![Render](https://img.shields.io/badge/deploy-render-purple)
![License](https://img.shields.io/badge/license-MIT-green)

API REST desenvolvida com **Node.js + TypeScript + PostgreSQL**, com autenticação JWT, testes automatizados, CI/CD com GitHub Actions e deploy na Render.

Projeto criado para estudo de backend moderno com pipeline completa de desenvolvimento.

---

## 🔗 Links

- 🌐 API online: https://simpay-api.onrender.com/
- 📚 Swagger Docs: https://simpay-api.onrender.com/docs
- 💻 GitHub: https://github.com/p3drosantos/simpay
- 🗄️ Database: Neon PostgreSQL
- 🚀 Deploy: Render
- ⚙️ CI/CD: GitHub Actions

---

## 🧰 Tecnologias

- Node.js
- TypeScript
- Express
- PostgreSQL
- Drizzle ORM
- JWT Authentication
- Jest
- ESLint
- Prettier
- Husky
- Swagger
- Docker
- GitHub Actions
- Render
- NeonDB

---

## 📦 Instalação

```bash
git clone https://github.com/p3drosantos/simpay

cd simpay

pnpm install
```

Criar arquivo `.env`

```env
DATABASE_URL=
JWT_SECRET=
PORT=3000
```

Rodar migrations

```bash
npx drizzle-kit migrate
```

Rodar projeto

```bash
pnpm dev
```

---

## 🧪 Testes

```bash
pnpm test
```

Os testes usam banco isolado com `.env.test`.

---

## ⚙️ CI/CD

Pipeline automatizada com GitHub Actions.

Fluxo:

```
push → check → migrate → deploy → render → online
```

Jobs executados:

- ✅ ESLint
- ✅ Prettier
- ✅ Tests
- ✅ Migration no banco real
- ✅ Deploy automático na Render

---

## 🔐 Autenticação

Autenticação com JWT.

Rotas públicas:

```
POST /users
POST /auth/login
```

Rotas protegidas usam Bearer Token.

```
Authorization: Bearer TOKEN
```

---

## 📚 Documentação

Swagger disponível em:

```
/docs
```

Online:

https://simpay-api.onrender.com/docs

---

## 🗄️ Banco de dados

PostgreSQL hospedado no Neon.

Migrations com Drizzle ORM.

Banco local via Docker.

---

## 🚀 Deploy

Deploy automático usando:

- GitHub Actions
- Render Deploy Hook
- Neon Database

Cada push na main executa:

```
check → migrate → deploy
```

---

## 📁 Estrutura

```
src/
  controllers/
  routes/
  middlewares/
  use-cases/
  db/
  config/

tests/

drizzle/

.github/workflows/
```

---

## 👨‍💻 Autor

Pedro Santos

GitHub:
https://github.com/p3drosantos
