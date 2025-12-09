# Sistema de Controle de Tarefas (Kanban) - PGE-CE

Este projeto é uma aplicação Single Page Application (SPA) desenvolvida como teste prático para a vaga de Desenvolvedor Front-End da Procuradoria Geral do Estado do Ceará.

A aplicação implementa um quadro Kanban interativo com gerenciamento completo de tarefas, validações complexas e arquitetura moderna.

## 🚀 Tecnologias e Arquitetura

O projeto foi construído utilizando as práticas mais recentes do ecossistema Angular (v19):

- **Core:** Angular 19 (Standalone Components).
- **Gerenciamento de Estado:** Angular Signals (`writableSignal`, `computed`) para reatividade granular e performance (Zone-less ready).
- **UI Components:** PrimeNG 19 (Card, Dialog, Toast, Inputs).
- **Estilização:** Tailwind CSS v3 (Utility-first CSS).
- **Drag & Drop:** Angular CDK (@angular/cdk/drag-drop).
- **API Mock:** JSON-Server.
- **Infraestrutura:** Docker & Docker Compose (Nginx + Node).

## ✨ Funcionalidades

- **Quadro Kanban:** Visualização por colunas (A Fazer, Em Andamento, Concluído) com Drag & Drop fluido.
- **CRUD Completo:** Criação, Edição, Exclusão e Movimentação de tarefas.
- **Filtros Reativos:** Busca em tempo real por Título/Tags e filtro por Prioridade usando _Computed Signals_.
- **Validações Avançadas:**
  - Lógica condicional: Prioridade "Urgente" torna a Data de Entrega obrigatória.
  - Validação customizada: Bloqueio de palavras proibidas (ex: "bug") no título.
  - Validação de data futura.
- **Observabilidade:** Feedback visual via Toasts (PrimeNG) e Logging centralizado de erros via Interceptor.
- **Badge de Notificação:** Contador reativo de tarefas urgentes pendentes.

## 🛠️ Como Executar o Projeto

Você pode rodar o projeto de duas formas: usando Docker (recomendado) ou manualmente via Node.js.

### Opção A: Via Docker (Recomendado)

Garante que o ambiente seja idêntico ao de desenvolvimento, sem conflitos de versões.

1.  Certifique-se de ter o **Docker** e **Docker Compose** instalados.
2.  Na raiz do projeto, execute:
    ```bash
    docker-compose up --build
    ```
3.  Acesse a aplicação em: `http://localhost:80` (Porta 80)
4.  A API Mock estará rodando internamente.

### Opção B: Manualmente (Local)

Pré-requisitos: Node.js v20+ e NPM.

1.  Instale as dependências:
    ```bash
    cd src/frontend
    npm install
    ```
2.  Inicie a API Mock (Terminal 1):
    ```bash
    npx json-server db.json --port 3000
    ```
3.  Inicie o Angular (Terminal 2):
    ```bash
    npx ng serve
    ```
4.  Acesse em: `http://localhost:4200`

## ✅ Executando os Testes

O projeto possui testes unitários cobrindo as regras de negócio críticas (ex: validação condicional de formulário).

```bash
npm test
```
