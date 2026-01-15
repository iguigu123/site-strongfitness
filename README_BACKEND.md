# Backend StrongFitness - Refatorado

Este projeto é uma refatoração completa do backend do e-commerce StrongFitness, seguindo princípios de **Clean Architecture**, **SOLID** e melhores práticas de segurança.

## 🚀 Tecnologias

- **Node.js** com **TypeScript**
- **Express** (Framework Web)
- **Tsyringe** (Injeção de Dependência)
- **JWT** (Autenticação) & **Bcrypt** (Hash de senhas)
- **Zod** (Validação de dados)
- **Repository Pattern** (Abstração de dados)

## 📂 Estrutura de Pastas

A estrutura segue a divisão por módulos e responsabilidades:

```
src/
├── config/             # Configurações globais (Auth, Upload, etc.)
├── modules/            # Módulos da aplicação (Domínios)
│   ├── auth/           # Autenticação
│   ├── products/       # Gestão de Produtos
│   └── users/          # Gestão de Usuários
│       ├── dtos/       # Data Transfer Objects
│       ├── entities/   # Entidades do domínio
│       ├── repositories/ # Contratos e implementações de banco
│       └── useCases/   # Regras de negócio (Controllers + Services)
├── shared/             # Código compartilhado
│   ├── container/      # Injeção de dependência
│   ├── errors/         # Tratamento de erros
│   └── infra/          # Camada de infraestrutura (Http, Server)
```

## 🛠️ Instalação e Execução

Como este ambiente não possui Node.js instalado globalmente acessível, siga os passos abaixo em sua máquina local:

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Execute o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

O servidor iniciará em `http://localhost:3333`.

## 📍 Rotas Disponíveis

### Autenticação
- `POST /api/auth/sessions`: Login (Email/Senha)

### Usuários
- `POST /api/users`: Criar conta (Nome, Email, Senha)

### Produtos
- `GET /api/products`: Listar todos os produtos

## 🔒 Segurança Implementada

- **JWT**: Tokens para sessões stateless.
- **Bcrypt**: Senhas nunca são salvas em texto plano.
- **Helmet**: Proteção de headers HTTP.
- **Zod**: Validação estrita de entrada de dados.
- **AppError**: Tratamento centralizado de exceções para não vazar stack traces.

## 📝 Notas sobre Persistência

Atualmente, o projeto utiliza **Repositórios em Memória** (`UsersRepositoryInMemory`, etc.) para facilitar a execução imediata sem necessidade de configurar um banco de dados externo (Postgres/MySQL).

Para produção, basta criar uma implementação `UsersRepositoryPostgres` que implemente `IUsersRepository` e alterar o registro no `shared/container/index.ts`.
