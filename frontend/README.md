# VW CRUD Application

Um sistema de gerenciamento de veículos desenvolvido com React e Node-RED.

## Requisitos

- Node.js 18.x ou superior
- NPM 9.x ou superior
- Node-RED instalado globalmente (`npm install -g node-red`)

## Configuração do Ambiente

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
└── backend/         # Configuração Node-RED
    ├── flows.json
    └── settings.js
```

## Notas de Desenvolvimento

- A API utiliza JWT para autenticação
- As imagens são armazenadas localmente
- A atualização de veículos utiliza POST em vez de PUT devido a limitações no upload de arquivos
- Dados são persistidos no contexto global do Node-RED