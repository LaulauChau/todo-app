# Todo App

## Description

This is a simple todo app that allows you to add, edit, and delete tasks. It also allows you to mark tasks as complete and prioritize them.

## What's included

- `apps/api` - An [Express](https://expressjs.com/) Rest API
- `apps/web` - A [Vue.js](https://vuejs.org/) web app
  <br />
- `packages/database` - A [Prisma](https://www.prisma.io/) database client
- `packages/eslint-config` - Shared [ESLint](https://eslint.org/) configuration
- `packages/typescript-config` - Shared [TypeScript](https://www.typescriptlang.org/) configuration

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20.9.0 or higher)
- [Yarn](https://yarnpkg.com/) (v1.22.21 or higher)
- [Docker](https://www.docker.com/) (v24.0.6 or higher)

### Steps

1. Clone the repository

```bash
git clone https://github.com/LaulauChau/todo-app.git
```

2. Install dependencies

```bash
yarn install
```

3. Copy the `.env.example` file to `.env`

```bash
cp .env.example .env
```

4. Start the database

```bash
docker-compose up -d
```

5. Run the migrations

```bash
yarn run db:migrate
```

6. Build the app

```bash
yarn run build
```

7. Start in development mode

```bash
yarn run dev
```

The api will be available at [http://localhost:3001](http://localhost:3001)
The web app will be available at [http://localhost:3000](http://localhost:3000)
