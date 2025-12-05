# Sistema de Controle de Tarefas (Kanban) - PGE-CE

Este projeto é uma aplicação Single Page Application (SPA) desenvolvida como teste prático para a vaga de Desenvolvedor Front-End da Procuradoria Geral do Estado do Ceará.

A aplicação implementa um quadro Kanban interativo com gerenciamento completo de tarefas, validações complexas e arquitetura moderna.

## Tecnologias e Arquitetura

O projeto foi construído utilizando as práticas mais recentes do ecossistema Angular (v19):

- **Core:** Angular 19 (Standalone Components).
- **Gerenciamento de Estado:** Angular Signals (`writableSignal`, `computed`) para reatividade granular e performance (Zone-less ready).
- **UI Components:** PrimeNG 19 (Card, Dialog, Toast, Inputs).
- **Estilização:** Tailwind CSS v3 (Utility-first CSS).
- **Drag & Drop:** Angular CDK (@angular/cdk/drag-drop).
- **API Mock:** JSON-Server.
- **Infraestrutura:** Docker & Docker Compose (Nginx + Node).
