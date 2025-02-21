# VW CRUD Application

Um sistema de gerenciamento de veículos desenvolvido com React e Node-RED.

## Requisitos

- Docker 20.x ou superior
- Docker Compose 2.x ou superior

Para desenvolvimento local (opcional):
- Node.js 18.x ou superior
- NPM 9.x ou superior
- Node-RED instalado globalmente (`npm install -g node-red`)

## Configuração do Ambiente

### Usando Docker Compose (Recomendado)

```bash
# Clone o repositório
git clone <repository-url>
cd vw-crud

# Inicie os containers
docker compose up -d

# Para visualizar os logs
docker compose logs -f
```

A aplicação estará disponível em:
- Frontend: http://localhost
- Backend (Node-RED): http://localhost:1880

### Desenvolvimento Local (Opcional)

1. **Frontend (React)**
```bash
cd frontend
npm install
npm start
```
A aplicação estará disponível em http://localhost:3000

2. **Backend (Node-RED)**
```bash
cd backend
npm install
node-red
```
O servidor Node-RED estará disponível em http://localhost:1880

## Credenciais Padrão

- **Usuário**: admin
- **Senha**: admin123

## Funcionalidades Principais

- Autenticação de usuários
- CRUD de veículos
- Upload de imagens
- Listagem paginada
- Ordenação e filtros
- Gerenciamento de usuários (admin)

## Estrutura do Projeto

```
vw-crud/
├── frontend/         # Aplicação React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── hooks/
│   └── Dockerfile   # Configuração do container Frontend
├── backend/         # Configuração Node-RED
│   ├── flows.json
│   └── settings.js
└── docker-compose.yml  # Configuração dos containers
```

## Notas de Desenvolvimento

- A API utiliza JWT para autenticação
- As imagens são armazenadas localmente
- A atualização de veículos utiliza POST em vez de PUT devido a limitações no upload de arquivos
- Dados são persistidos no contexto global do Node-RED

## Comandos Docker Úteis

```bash
# Parar os containers
docker compose down

# Reconstruir as imagens
docker compose build

# Visualizar status dos containers
docker compose ps

# Visualizar logs de um serviço específico
docker compose logs frontend
docker compose logs node-red
```

## Tecnologias Utilizadas

- Frontend:
  - React
  - Material-UI
  - Axios
  - React Router

- Backend:
  - Node-RED
  - JWT Authentication
  - File System para armazenamento de imagens

## Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request