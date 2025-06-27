# Testes Unitários - Black Hat Game

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

### 3. `setup.js`
- **Configuração do Jest** para simular o ambiente Phaser.js
- **Mocks das dependências** necessárias para os testes

## Como Executar os Testes

### Opção 1: Teste Simplificado (Recomendado)
```bash
node tests/dataCenterPC/dataCenterPC.simple.test.js
```

### Opção 2: Teste com Jest
```bash
npm install
npm run test:jest
```

### Opção 3: Usando npm test (padrão)
```bash
npm test
```

### Funcionalidades Testadas:

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

## Estrutura dos Testes

### Mock Classes Criadas:
- `MockAdd`: Simula `this.add` do Phaser
- `MockSound`: Simula `this.sound` do Phaser
- `MockInput`: Simula `this.input` do Phaser
- `MockCameras`: Simula `this.cameras` do Phaser
- `MockCoinBar`: Simula a classe CoinBar
- `MockCoreBar`: Simula a classe CoreBar

### Função Testada:
```javascript
openPuzzle() {
    // Cria popup do puzzle
    // Configura grid 3x3 de peças
    // Adiciona botões e labels
    // Configura interatividade
}
```

```
## Scripts Disponíveis

```json
{
  "test": "node tests/dataCenterPC/dataCenterPC.simple.test.js",
  "test:jest": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```