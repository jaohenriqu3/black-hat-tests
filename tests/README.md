# Testes Unitários - Black Hat Game

## Teste Automatizado Geral

### `run-all-simple-tests.js`
- **Executa todos os testes simples automaticamente**
- **Não requer dependências externas**
- **Resultados coloridos e organizados**
- **Resumo final com estatísticas**
- **Execução**: `npm test` ou `node tests/run-all-simple-tests.js`

### Funcionalidades do Teste Automatizado:
- Executa **34 testes individuais** em sequência
- **Cobertura completa** das funções principais
- **Feedback visual** com cores (verde para sucesso, vermelho para falha)
- **Tempo de execução** medido automaticamente
- **Resumo final** com estatísticas detalhadas

## Arquivos de Teste

### 1. `dataCenterPC/dataCenterPC.simple.test.js`
- **Versão simplificada** que pode ser executada diretamente no Node.js
- **Não requer dependências externas** como Jest
- **Simula o ambiente Phaser.js** para testar a funcionalidade
- **Execução direta**: `node tests/dataCenterPC/dataCenterPC.simple.test.js`

### 2. `dataCenterPC/dataCenterPC.test.js`
- **Versão completa** usando Jest como framework de teste
- **Requer instalação**: `npm install`
- **Execução**: `npm run test:jest`

### 3. `danteCell/danteCell.simple.test.js`
- **Versão simplificada** para testes do DanteCell
- **Testa a função `openPuzzle()`** da classe DanteCell
- **Cobre criação do puzzle e lógica de verificação**
- **Execução direta**: `node tests/danteCell/danteCell.simple.test.js`

### 4. `danteCell/danteCell.test.js`
- **Versão completa** usando Jest para testes do DanteCell
- **Testes organizados em grupos**: criação, lógica de verificação e interatividade
- **Execução**: `npm run test:jest`

### 5. `blackLock/blackLock.simple.test.js`
- **Versão simplificada** para testes do BlackLock
- **Testa a função `openPuzzle()`** da classe BlackLock
- **Cobre criação do puzzle, lógica de operações e feedback**
- **Execução direta**: `node tests/blackLock/blackLock.simple.test.js`

### 6. `blackLock/blackLock.test.js`
- **Versão completa** usando Jest para testes do BlackLock
- **Testes organizados em grupos**: criação, lógica de operações, feedback e visuais
- **Execução**: `npm run test:jest`

### 7. `setup.js`
- **Configuração do Jest** para simular o ambiente Phaser.js
- **Mocks das dependências** necessárias para os testes

## Como Executar os Testes

### Opção 1: Teste Automatizado Geral (Recomendado)

**Executa todos os testes simples automaticamente:**

```bash
npm test
```

**Ou diretamente:**

```bash
node tests/run-all-simple-tests.js
```

### Opção 2: Teste Individual Simplificado

**Para DataCenterPC:**
```bash
node tests/dataCenterPC/dataCenterPC.simple.test.js
```

**Para DanteCell:**
```bash
node tests/danteCell/danteCell.simple.test.js
```

**Para BlackLock:**
```bash
node tests/blackLock/blackLock.simple.test.js
```

### Opção 3: Teste com Jest
```bash
npm install
npm run test:jest
```

### Opção 4: Usando npm test (padrão)
```bash
npm test
```

## Funcionalidades Testadas

### DataCenterPC - Funcionalidades Testadas:

1. **Criação do Popup**
   - Verifica se `popupOpen` é definido como `true`
   - Confirma se o popup do puzzle é criado

2. **Elementos da Interface**
   - Botão de fechar (X)
   - Label "Conecte os circuitos"
   - Botão "Verificar"

3. **Grid do Puzzle (3x3)**
   - Verifica se 9 peças são criadas
   - Confirma propriedades das peças (rotationState, correctRotation, textureKey)
   - Testa interatividade das peças

4. **Configurações Visuais**
   - Depth correto dos elementos (10 e 11)
   - Escala das peças (2.0)
   - Posicionamento dos elementos

5. **Limpeza de Recursos**
   - Verifica se `closePuzzle()` limpa corretamente os objetos
   - Confirma se `popupOpen` volta para `false`

### DanteCell - Funcionalidades Testadas:

1. **Criação do Puzzle**
   - Verifica se `popupOpen` é definido como `true`
   - Confirma se o container do puzzle é criado
   - Testa criação de 4 textos binários interativos

2. **Sequência Inicial**
   - Verifica se a sequência inicial é `[0, 1, 0, 1]`
   - Confirma que 4 elementos binários são criados

3. **Elementos da Interface**
   - Botão de verificar com estilo correto
   - Botão de fechar (X)
   - Mensagem do puzzle para feedback

4. **Lógica de Verificação**
   - Testa se a sequência correta é `"0110"`
   - Verifica mensagens de sucesso e falha
   - Confirma mudança de cor das mensagens

5. **Gerenciamento de Visibilidade**
   - Ocultação de `titleText` e `criptoIcon` quando puzzle abre
   - Restauração da visibilidade quando puzzle fecha
   - Limpeza correta dos recursos

6. **Interatividade**
   - Configuração de interatividade nos textos binários
   - Interatividade nos botões de verificar e fechar

### BlackLock - Funcionalidades Testadas:

1. **Criação do Puzzle**
   - Criação do background do puzzle
   - Criação do texto da chave alvo
   - Criação dos blocos de bits e textos
   - Criação do texto de resultado
   - Criação dos botões de operação (AND, OR, XOR, NOT)

2. **Lógica de Operações**
   - Teste das operações AND, OR, XOR, NOT
   - Verificação do resultado exibido

3. **Feedback e Resultados**
   - Mensagem de sucesso quando resultado correto
   - Mensagem de falha quando resultado incorreto
   - Perda de core quando falha
   - Transição para BlackOffice ou GameOver

4. **Configurações Visuais**
   - Cores corretas nos elementos
   - Padding nos textos dos bits e botões
   - Depth correto nos elementos

5. **Interatividade**
   - Botões de operação são interativos

## Estrutura dos Testes

### Mock Classes Criadas:
- `MockAdd`: Simula `this.add` do Phaser
- `MockSound`: Simula `this.sound` do Phaser
- `MockInput`: Simula `this.input` do Phaser
- `MockCameras`: Simula `this.cameras` do Phaser
- `MockCoinBar`: Simula a classe CoinBar
- `MockCoreBar`: Simula a classe CoreBar
- `MockVisibility`: Simula elementos com propriedade visible (DanteCell)

### Funções Testadas:

**DataCenterPC:**
```javascript
openPuzzle() {
    // Cria popup do puzzle
    // Configura grid 3x3 de peças
    // Adiciona botões e labels
    // Configura interatividade
}
```

**DanteCell:**
```javascript
openPuzzle() {
    // Cria container do puzzle
    // Configura 4 textos binários interativos
    // Adiciona botões de verificar e fechar
    // Configura lógica de verificação (sequência "0110")
}

closePuzzle() {
    // Limpa recursos do puzzle
    // Restaura visibilidade dos elementos
}
```

**BlackLock:**
```javascript
openPuzzle() {
    // Cria background, textos, blocos de bits, botões e resultado
    // Configura operações lógicas (AND, OR, XOR, NOT)
    // Adiciona feedback visual e transições
}

applyOperation(op, targetKey) {
    // Executa operação lógica e atualiza resultado
    // Mostra feedback de sucesso ou falha
}
```

## Scripts Disponíveis

```json
{
  "test": "node tests/run-all-simple-tests.js",
  "test:all": "node tests/run-all-simple-tests.js",
  "test:simple": "node tests/dataCenterPC/dataCenterPC.simple.test.js",
  "test:jest": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

## Resultados do Teste Automatizado

- **Total de testes**: 34
- **Taxa de sucesso**: 100%
- **Tempo de execução**: ~0.2 segundos
- **Módulos testados**: 3 (DataCenterPC, DanteCell, BlackLock)

```