describe('Fluxo Kanban (E2E)', () => {
  // Dados simulados para o Mock
  const mockTask = {
    id: '1',
    title: 'Tarefa de Teste Cypress',
    description: 'Descrição automática',
    priority: 'Alta',
    status: 'A Fazer',
    tags: ['e2e'],
    dueDate: new Date().toISOString(),
  };

  beforeEach(() => {
    // 1. MOCK DA LEITURA (GET)
    // Começamos com uma lista vazia ou com itens controlados
    cy.intercept('GET', '/api/tarefas', {
      statusCode: 200,
      body: [], // Começa vazio para testarmos a criação limpa
    }).as('getTasks');

    // 2. MOCK DA CRIAÇÃO (POST)
    cy.intercept('POST', '/api/tarefas', {
      statusCode: 201,
      body: mockTask,
    }).as('createTask');

    // 3. MOCK DA EDIÇÃO (PUT) - Para o Drag & Drop
    cy.intercept('PUT', '/api/tarefas/*', {
      statusCode: 200,
      body: { ...mockTask, status: 'Em Andamento' },
    }).as('updateTask');

    cy.visit('http://localhost:4200'); // Ajuste a porta se necessário
  });

  it('Deve criar uma nova tarefa com sucesso', () => {
    // 1. Navegar para o form
    cy.get('button[label="Nova Tarefa"]').click();

    // Verifica se mudou a URL
    cy.url().should('include', '/nova-tarefa');

    // 2. Preencher o Formulário (PrimeNG e Inputs normais)
    cy.get('input[formControlName="title"]').type('Tarefa de Teste Cypress');
    cy.get('textarea[formControlName="description"]').type(
      'Descrição automática'
    );

    // Lidar com p-dropdown (Prioridade)
    cy.get('p-dropdown[formControlName="priority"]').click();
    // O PrimeNG joga o dropdown num layer separado, usamos contains para achar
    cy.get('p-dropdownitem').contains('Alta').click();

    // Lidar com p-chips (Tags)
    cy.get('p-chips ul').type('e2e{enter}');

    // 3. Simular o retorno da API com a nova tarefa na lista
    // Atualizamos o intercept para retornar a tarefa criada na próxima chamada
    cy.intercept('GET', '/api/tarefas', [mockTask]).as('getTasksAfterCreate');

    // 4. Salvar
    cy.get('button[type="submit"]').click();

    // 5. Verificar Feedback e Redirecionamento
    // Verifica se o Toast apareceu (classe do PrimeNG)
    cy.get('.p-toast-message-success').should('be.visible');

    // Verifica se voltou para a home
    cy.url().should('not.include', '/nova-tarefa');

    // Verifica se o Card apareceu na coluna "A Fazer"
    cy.contains('Tarefa de Teste Cypress').should('be.visible');
    cy.contains('Alta').should('be.visible'); // Badge de prioridade
  });

  it('Deve mover uma tarefa de "A Fazer" para "Em Andamento" (Drag & Drop)', () => {
    // PREPARAÇÃO
    cy.intercept('GET', '/api/tarefas', [mockTask]).as('getTasksStart');
    cy.visit('http://localhost:4200');

    // Aguarda o card renderizar para garantir que a tela está pronta
    cy.contains('Tarefa de Teste Cypress').should('be.visible');

    // 1. Identificar Origem e Destino com precisão
    // Pegamos a segunda coluna (Index 1 = Em Andamento)
    // .eq(0) = A Fazer, .eq(1) = Em Andamento, .eq(2) = Concluído
    cy.get('.cdk-drop-list').eq(1).as('targetColumn');

    // 2. Executar o Drag & Drop
    // Arrastamos o card especificamente para o alias '@targetColumn' que definimos acima
    cy.get('.cdk-drag').first().as('card');

    // 2. Define Alias para a Coluna de Destino (Em Andamento - Index 1)
    cy.get('.cdk-drop-list').eq(1).as('targetCol');

    // 3. Executa o Drag com opções explícitas de posição
    // O CDK precisa que o mouse passe pelo centro para ativar a 'drop zone'
    cy.get('@card').drag('@targetCol', {
      source: { position: 'center' },
      target: { position: 'center' },
      force: true,
    } as any);

    // 4. Validação da API
    // Se o drag funcionar, a API será chamada.
    cy.wait('@updateTask', { timeout: 10000 })
      .its('request.body.status')
      .should('equal', 'Em Andamento');
  });
});
