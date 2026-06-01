# John Doe – Formulário de Cadastro de Clientes

Aplicação full stack para cadastro de clientes, construída com Turborepo, TypeScript, React e Node.js.

## Arquitetura

```
john-doe-form/
├── apps/
│   ├── web/          # React + Vite (frontend)
│   └── api/          # Node.js + Express (backend)
└── packages/
    ├── shared/        # DTOs, schemas Zod, tipos compartilhados
    └── eslint-config/ # Configuração ESLint reutilizável
```

### Decisões de design

| Camada | Padrão | Motivo |
|--------|--------|--------|
| Backend | Repository Pattern | Isola acesso ao banco; fácil trocar de ORM/DB |
| Backend | Service Layer | Regras de negócio desacopladas do HTTP |
| Shared | Schema-first com Zod | Mesma validação no front e no back, zero duplicação |
| Frontend | React Hook Form + Zod | Validação performática sem re-renders desnecessários |

## Pré-requisitos

- Node.js 20+
- Docker & Docker Compose (para o banco local)

## Rodando localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Subir o banco com Docker

```bash
docker-compose up postgres -d
```

### 3. Configurar variáveis de ambiente

```bash
# Backend
cp apps/api/.env.example apps/api/.env

# Frontend
cp apps/web/.env.example apps/web/.env
```

### 4. Rodar as migrations

```bash
npm run db:migrate --workspace=@john-doe/api
```

### 5. Iniciar em modo dev

```bash
npm run dev
```

- Frontend: http://localhost:5173  
- API: http://localhost:3001/api  
- Health check: http://localhost:3001/api/health  

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/health` | Status da API |
| `GET` | `/api/colors` | Lista cores disponíveis |
| `POST` | `/api/customers` | Cadastra novo cliente |

### POST `/api/customers`

```json
{
  "fullName": "João da Silva",
  "cpf": "123.456.789-09",
  "email": "joao@exemplo.com",
  "favoriteColor": "BLUE",
  "observations": "Opcional"
}
```

**Respostas:**

- `201` – Cadastro realizado com sucesso
- `409` – CPF ou e-mail já cadastrado
- `422` – Dados inválidos (retorna `details` com erros por campo)
- `500` – Erro interno

## Deploy

### Frontend – Vercel

```bash
vercel --prod
```

Defina a variável de ambiente `VITE_API_URL` no painel da Vercel apontando para a URL da sua API.

### Backend + Banco – Docker

```bash
docker-compose up --build
```

## Lint

```bash
npm run lint
```

## Tecnologias

- **Turborepo** – monorepo com cache de build
- **TypeScript** – tipagem estática end-to-end
- **React 18 + Vite** – frontend
- **React Hook Form + Zod** – formulário com validação compartilhada
- **Node.js + Express** – API REST
- **PostgreSQL 16** – banco de dados
- **Docker & Docker Compose** – containerização
- **Vercel** – deploy do frontend
- **ESLint** – qualidade de código
