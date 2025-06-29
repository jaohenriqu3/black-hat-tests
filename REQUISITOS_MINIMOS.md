# Requisitos Mínimos - Black Hat Game

## Análise Baseada no Teste de Performance

Com base na análise completa do jogo, segue os seguintes requisitos mínimos para execução perfeita:

## Especificações Técnicas

### **Processador (CPU)**
- **Mínimo**: Intel Core i3-6100 / AMD FX-6300 ou superior
- **Recomendado**: Intel Core i5-8400 / AMD Ryzen 5 2600 ou superior

### **Memória RAM**
- **Mínimo**: 4 GB RAM
- **Recomendado**: 8 GB RAM

### **Armazenamento**
- **Mínimo**: 200 MB de espaço livre
- **Recomendado**: 500 MB de espaço livre

### **Placa de Vídeo (GPU)**
- **Mínimo**: GPU integrada com suporte a WebGL 1.0
- **Recomendado**: GPU dedicada com 2GB VRAM

### **Navegador**
- **Mínimo**: Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- **Recomendado**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### **Conexão com Internet**
- **Mínimo**: 2 Mbps (para carregamento inicial)
- **Recomendado**: 10 Mbps

## Performance Esperada

### **Tempo de Carregamento**
- **Primeira execução**: ~3.5 segundos
- **Execuções subsequentes**: ~1.5 segundos (cache)
- **Score de Performance**: 89/100 (Excelente)

### **FPS (Frames por Segundo)**
- **Mínimo**: 30 FPS
- **Recomendado**: 60 FPS

## Compatibilidade

### **Sistemas Operacionais**
- **Windows**: 10 ou superior
- **macOS**: 10.14 (Mojave) ou superior
- **Linux**: Ubuntu 18.04+ / Debian 10+ / Fedora 30+

### **Resolução de Tela**
- **Mínimo**: 1024x768
- **Recomendado**: 1920x1080

## Otimizações Recomendadas

### **Para Melhor Performance**
1. **Fechar outras abas** do navegador durante o jogo
2. **Desativar extensões** que consomem memória
3. **Usar modo de jogo** do navegador (F11)
4. **Manter drivers** de vídeo atualizados

### **Para Conexão Lenta**
1. **Aguardar carregamento completo** antes de jogar
2. **Evitar interromper** o carregamento inicial
3. **Usar conexão estável** (WiFi ou cabo)

## Teste de Compatibilidade

Para verificar se seu sistema atende aos requisitos:

```bash
# Execute o teste de performance
node tests/performance-test.js

# Verifique se o score é maior que 70/100
# Tempo de carregamento menor que 5 segundos
```

## Suporte 

Se encontrar problemas de performance:
1. Verifique se atende aos requisitos mínimos
2. Execute o teste de performance
---

**Nota**: Estes requisitos são baseados na análise técnica do jogo e podem variar dependendo da configuração específica do sistema. 