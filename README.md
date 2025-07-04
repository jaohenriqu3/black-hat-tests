# Testes - Black Hat Game

## Execução Rápida

### Teste Automatizado Geral (Recomendado)

Executa todos os testes simples automaticamente:

```bash
npm test
```

### Teste de Integração (executar separadamente)

Executa apenas o teste de integração entre cenas, cutscenes e screens:

```bash
node tests/integration-test.js
```

### Teste de Performance (executar separadamente)

Analisa todo o jogo de ponta a ponta, estimando tempo de carregamento e performance:

```bash
node tests/performance-test.js
```

### Teste Individual

```bash
node tests/danteCell/danteCell.simple.test.js
```

## Documentação Completa

Para mais detalhes sobre os testes, consulte:
- [Documentação dos Testes](tests/README.md)
- [Requisitos Mínimos do Sistema](REQUISITOS_MINIMOS.md)

## Scripts Disponíveis

- `npm test` - Executa todos os testes simples automaticamente
- `npm run test:all` - Alias para executar todos os testes simples
- `npm run test:simple` - Executa apenas o teste do DataCenterPC
- `npm run test:jest` - Executa testes com Jest
- `npm run test:watch` - Executa testes em modo watch
- `npm run test:coverage` - Executa testes com cobertura
- **`node tests/integration-test.js`** - Executa apenas o teste de integração entre cenas
- **`node tests/performance-test.js`** - Executa apenas o teste de performance geral

## Funcionalidades Testadas

O teste automatizado cobre todas as funções principais do jogo:

- **DataCenterPC**: `openPuzzle()` - Grid 3x3 de peças interativas
- **DanteCell**: `openPuzzle()` e `closePuzzle()` - Sequências binárias
- **BlackLock**: `openPuzzle()` e `applyOperation()` - Operações lógicas

O teste de integração verifica a comunicação entre todas as cenas, cutscenes e screens do projeto, além de dependências e transições.

O teste de performance analisa todo o jogo de ponta a ponta, incluindo:
- Tamanho total dos assets
- Número de cenas, componentes, prefabs e NPCs
- Tempo estimado de carregamento
- Score de performance geral

## Resultados

- **34 testes individuais** executados automaticamente
- **100% de taxa de sucesso**
- **Tempo de execução**: ~0.2 segundos