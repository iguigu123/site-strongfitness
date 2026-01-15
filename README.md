# StrongFitness API

## Visão Geral
- Arquitetura orientada a casos de uso com separação clara entre camadas.
- Injeção de dependências para repos e serviços.
- Cache e filas desacoplados por interfaces para testes rápidos.
- Documentação via OpenAPI acessível em /api/docs.

## Tecnologias
- Node.js, Express, TypeScript
- Tsyringe para DI
- JWT para autenticação
- Zod para validação
- BullMQ para filas
- Redis para cache/filas (em produção)
- Prisma para persistência (quando habilitado)
- Jest para testes
- ESLint e Prettier para qualidade
- Helmet, CORS, Rate Limit, Compression, Morgan

## Estrutura de Pastas
- src/modules: domínio por módulo (auth, users, products, orders)
- src/shared: infraestrutura comum (http, cache, queues, container)
- tests: unitários e integração
- coverage: relatórios de cobertura

## Fluxo de Autenticação
- POST /api/auth/sessions valida credenciais e retorna token com expiração.
- Middleware ensureAuthenticated protege rotas e injeta request.user.id.
- Refresh token disponível em /api/auth/refresh-token (quando habilitado).

## Fluxo de Pedidos
- POST /api/orders cria um identificador de pedido e enfileira processamento.
- Worker calcula total e marca status como PROCESSED quando persistência estiver ativa.
- Em testes, filas e cache são mockados para velocidade e isolamento.

## Cache e Filas
- CacheProvider define contrato com implementação Redis em produção.
- BullMQ gerencia filas; orderQueue adiciona jobs e orderWorker processa.

## Setup
- Copie .env e configure APP_SECRET, JWT_EXPIRES_IN, CORS_ORIGIN.
- Instale dependências: npm install
- Desenvolvimento: npm run dev
- Build: npm run build
- Produção: node dist/server.js

## Testes
- Unitários e integração: npm test
- Cobertura: npm run test:coverage
- Em ambientes sem Node habilitado, execute localmente.

## Operação com Docker
- Copie .env.example para .env e ajuste valores.
- Suba tudo com: docker compose up --build
- Serviços: api (porta 3333), db (Postgres), redis (6379)
- Health: GET /api/health, Readiness: GET /api/ready, Métricas: GET /api/metrics

## Deploy em Cloud (Railway/Render)
- Configure variáveis (APP_SECRET, DATABASE_URL, REDIS_HOST/PORT, CORS_ORIGIN).
- Porta dinâmica: a aplicação usa process.env.PORT.
- Migrations: container executa prisma migrate deploy se diretório prisma existir.
- Build: npm run build, Start: node dist/server.js

## Logs e Observabilidade
- Logs estruturados em JSON com níveis info/warn/error.
- Métricas por rota: contagem, erros e média de duração.
- Integração futura: exponha /api/metrics para Prometheus; configure dashboards no Grafana; envie erros para Sentry.

## Resiliência
- Graceful shutdown com desconexão do Prisma.
- Timeout de requests configurado para 30s.
- Fila com tentativa e backoff controlados.

## Segurança em Produção
- CORS controlado via CORS_ORIGIN.
- Headers via Helmet e rate limit.
- Sem exposição de dados sensíveis em logs.

## Checklist de Produção
- [.env] definido e secreto
- Banco e Redis acessíveis
- CORS restrito à origem do frontend
- Porta liberada e mapeada
- Health/Ready/Metrics respondendo
- Logs coletados e armazenados

## Deploy
- Configure variáveis de ambiente e origem de CORS restrita.
- Habilite Redis para filas e cache.
- Gere Prisma Client se usar DB: npm run prisma:generate
- Exponha porta definida por PORT; documentação em /api/docs.

## Segurança e Hardening
- Sem logs verbosos em produção; morgan combinado em produção.
- Helmet e rate limit ativos; CORS restritivo por ambiente.
- Dados sensíveis nunca retornados (senhas, tokens internos).

## Scripts
- lint: npm run lint
- format: npm run format
- test: npm test
- coverage: npm run test:coverage
