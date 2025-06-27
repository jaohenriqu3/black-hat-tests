class MockPhaser {
    constructor() {
        this.Scene = class MockScene {
            constructor() {
                this.add = new MockAdd();
                this.sound = new MockSound();
                this.input = new MockInput();
                this.cameras = new MockCameras();
            }
        };
        
        this.Input = {
            Keyboard: {
                KeyCodes: {
                    E: 'E'
                }
            }
        };
    }
}

class MockAdd {
    constructor() {
        this.createdObjects = [];
    }
    
    rectangle(x, y, width, height, color, alpha) {
        const rect = {
            x, y, width, height, color, alpha,
            setOrigin: (origin) => ({ origin }),
            setInteractive: () => ({ setInteractive: true }),
            setDepth: (depth) => ({ depth }),
            setStrokeStyle: (width, color) => ({ strokeWidth: width, strokeColor: color }),
            on: (event, callback) => ({ event, callback }),
            destroy: () => ({ destroyed: true })
        };
        this.createdObjects.push(rect);
        return rect;
    }
    
    text(x, y, text, style) {
        const textObj = {
            x, y, text, style,
            setOrigin: (origin) => ({ origin }),
            setInteractive: () => ({ setInteractive: true }),
            setDepth: (depth) => ({ depth }),
            setVisible: (visible) => ({ visible }),
            setColor: (color) => ({ color }),
            setText: (text) => ({ text }),
            setPadding: (padding) => ({ padding }),
            on: (event, callback) => ({ event, callback }),
            destroy: () => ({ destroyed: true })
        };
        this.createdObjects.push(textObj);
        return textObj;
    }
    
    image(x, y, texture) {
        const image = {
            x, y, texture,
            setDepth: (depth) => ({ depth }),
            setInteractive: () => ({ setInteractive: true }),
            setScale: (scale) => ({ scale }),
            setVisible: (visible) => ({ visible }),
            on: (event, callback) => ({ event, callback }),
            destroy: () => ({ destroyed: true })
        };
        this.createdObjects.push(image);
        return image;
    }
    
    container(x, y) {
        const container = {
            x, y,
            children: [],
            add: (child) => {
                container.children.push(child);
                return container;
            },
            destroy: () => ({ destroyed: true })
        };
        this.createdObjects.push(container);
        return container;
    }
}

class MockSound {
    add(key, config) {
        return {
            play: () => ({ playing: true }),
            stop: () => ({ stopped: true })
        };
    }
}

class MockInput {
    constructor() {
        this.keyboard = {
            addKey: (keyCode) => ({
                keyCode,
                isDown: false
            })
        };
    }
}

class MockCameras {
    constructor() {
        this.main = {
            fadeOut: (duration, red, green, blue) => ({ duration, red, green, blue }),
            once: (event, callback) => ({ event, callback })
        };
    }
}

const mockCoinBar = class MockCoinBar {
    constructor(scene, x, y) {
        this.container = { setScale: (scale) => ({ scale }) };
    }
};

const mockCoreBar = class MockCoreBar {
    constructor(scene, x, y) {
        this.container = { setScale: (scale) => ({ scale }) };
    }
    
    loseCore() {
        return { coreLost: true };
    }
    
    getCoreCount() {
        return 3;
    }
};

const mockGameState = {
    getChapter: () => 4
};

describe('BlackLock - openPuzzle()', () => {
    let blackLock;
    let mockPhaser;
    
    beforeEach(() => {
        mockPhaser = new MockPhaser();
        global.Phaser = mockPhaser;
        
        jest.mock('./black-hat/src/components/coinBar/coinBar.js', () => mockCoinBar);
        jest.mock('./black-hat/src/components/coreBar/coreBar.js', () => mockCoreBar);
        jest.mock('./black-hat/src/state/gameState.js', () => mockGameState);
        
        const BlackLock = require('./black-hat/src/scenes/cap4/blackLock.js').default;
        blackLock = new BlackLock();
        
        blackLock.popupOpen = false;
        blackLock.add = new MockAdd();
        blackLock.coreBar = new mockCoreBar();
        blackLock.scene = { start: jest.fn() };
        blackLock.cameras = new MockCameras();
    });
    
    test('deve criar o background do puzzle', () => {
        blackLock.openPuzzle();
        
        expect(blackLock.puzzleBackground).toBeDefined();
    });
    
    test('deve criar o texto da chave alvo', () => {
        blackLock.openPuzzle();
        
        const keyText = blackLock.add.createdObjects.find(obj => 
            obj.text && obj.text.includes("Chave: 1101")
        );
        expect(keyText).toBeDefined();
    });
    
    test('deve criar os blocos de bits', () => {
        blackLock.openPuzzle();
        
        expect(blackLock.bitBlocks).toHaveLength(2);
        expect(blackLock.bitBlocks[0]).toBe("0010");
        expect(blackLock.bitBlocks[1]).toBe("0111");
    });
    
    test('deve criar os textos dos bits', () => {
        blackLock.openLock();
        
        expect(blackLock.bitTexts).toHaveLength(2);
    });
    
    test('deve criar o texto de resultado', () => {
        blackLock.openPuzzle();
        
        expect(blackLock.resultText).toBeDefined();
    });
    
    test('deve criar os botões de operação', () => {
        blackLock.openPuzzle();
        
        const operations = ["AND", "OR", "XOR", "NOT"];
        operations.forEach(op => {
            const btn = blackLock.add.createdObjects.find(obj => 
                obj.text === op && obj.style && obj.style.backgroundColor === "#5BE402"
            );
            expect(btn).toBeDefined();
        });
    });
    
    test('deve configurar interatividade nos botões', () => {
        blackLock.openPuzzle();
        
        const operations = ["AND", "OR", "XOR", "NOT"];
        operations.forEach(op => {
            const btn = blackLock.add.createdObjects.find(obj => obj.text === op);
            expect(btn.setInteractive).toBe(true);
        });
    });
    
    test('deve configurar depth correto nos elementos', () => {
        blackLock.openPuzzle();
        
        // Verificar se todos os elementos têm depth 11
        const elementsWithDepth = blackLock.add.createdObjects.filter(obj => obj.depth === 11);
        expect(elementsWithDepth.length).toBeGreaterThan(0);
    });
});

describe('BlackLock - Lógica de Operações', () => {
    let blackLock;
    
    beforeEach(() => {
        const mockPhaser = new MockPhaser();
        global.Phaser = mockPhaser;
        
        const BlackLock = require('./black-hat/src/scenes/cap4/blackLock.js').default;
        blackLock = new BlackLock();
        blackLock.add = new MockAdd();
        blackLock.coreBar = new mockCoreBar();
        blackLock.scene = { start: jest.fn() };
        blackLock.cameras = new MockCameras();
    });
    
    test('deve calcular operação AND corretamente', () => {
        blackLock.openPuzzle();
        
        blackLock.applyOperation("AND", "1101");
        expect(blackLock.resultText.text).toBe("Resultado: 0010");
    });
    
    test('deve calcular operação OR corretamente', () => {
        blackLock.openPuzzle();
        
        blackLock.applyOperation("OR", "1101");
        expect(blackLock.resultText.text).toBe("Resultado: 0111");
    });
    
    test('deve calcular operação XOR corretamente', () => {
        blackLock.openPuzzle();
        
        blackLock.applyOperation("XOR", "1101");
        expect(blackLock.resultText.text).toBe("Resultado: 0101");
    });
    
    test('deve calcular operação NOT corretamente', () => {
        blackLock.openPuzzle();
        
        blackLock.applyOperation("NOT", "1101");
        expect(blackLock.resultText.text).toBe("Resultado: 1101");
    });
});

describe('BlackLock - Resultados e Feedback', () => {
    let blackLock;
    
    beforeEach(() => {
        const mockPhaser = new MockPhaser();
        global.Phaser = mockPhaser;
        
        const BlackLock = require('./black-hat/src/scenes/cap4/blackLock.js').default;
        blackLock = new BlackLock();
        blackLock.add = new MockAdd();
        blackLock.coreBar = new mockCoreBar();
        blackLock.scene = { start: jest.fn() };
        blackLock.cameras = new MockCameras();
    });
    
    test('deve mostrar sucesso quando resultado está correto', () => {
        blackLock.openPuzzle();
        
        // Simular resultado correto
        blackLock.resultText.setText("Resultado: 1101");
        blackLock.applyOperation("AND", "1101");
        
        expect(blackLock.true).toBeDefined();
        expect(blackLock.nextBtn).toBeDefined();
    });
    
    test('deve mostrar falha quando resultado está incorreto', () => {
        blackLock.openPuzzle();
        
        // Simular resultado incorreto
        blackLock.resultText.setText("Resultado: 0000");
        blackLock.applyOperation("AND", "1101");
        
        expect(blackLock.false).toBeDefined();
    });
    
    test('deve perder core quando resultado está incorreto', () => {
        blackLock.openPuzzle();
        
        const loseCoreSpy = jest.spyOn(blackLock.coreBar, 'loseCore');
        
        blackLock.resultText.setText("Resultado: 0000");
        blackLock.applyOperation("AND", "1101");
        
        expect(loseCoreSpy).toHaveBeenCalled();
    });
    
    test('deve iniciar BlackOffice quando sucesso', () => {
        blackLock.openPuzzle();
        
        // Simular resultado correto
        blackLock.resultText.setText("Resultado: 1101");
        blackLock.applyOperation("AND", "1101");
        
        // Simular clique no botão "Abrir"
        blackLock.nextBtn.callback();
        
        expect(blackLock.scene.start).toHaveBeenCalledWith("BlackOffice");
    });
    
    test('deve iniciar GameOver quando cores acabam', () => {
        blackLock.openPuzzle();
        
        blackLock.coreBar.getCoreCount = () => 0;
        
        blackLock.resultText.setText("Resultado: 0000");
        blackLock.applyOperation("AND", "1101");
        
        expect(blackLock.scene.start).toHaveBeenCalledWith("Chapter1GameOver");
    });
});

describe('BlackLock - Configurações Visuais', () => {
    let blackLock;
    
    beforeEach(() => {
        const mockPhaser = new MockPhaser();
        global.Phaser = mockPhaser;
        
        const BlackLock = require('./black-hat/src/scenes/cap4/blackLock.js').default;
        blackLock = new BlackLock();
        blackLock.add = new MockAdd();
        blackLock.coreBar = new mockCoreBar();
        blackLock.scene = { start: jest.fn() };
        blackLock.cameras = new MockCameras();
    });
    
    test('deve configurar cores corretas nos elementos', () => {
        blackLock.openPuzzle();
        
        // Verificar cor da chave alvo
        const keyText = blackLock.add.createdObjects.find(obj => 
            obj.text && obj.text.includes("Chave: 1101")
        );
        expect(keyText.style.fill).toBe("#5BE402");
        
        // Verificar cor do resultado
        expect(blackLock.resultText.style.fill).toBe("#FFD700");
        
        // Verificar cor dos botões
        const andBtn = blackLock.add.createdObjects.find(obj => obj.text === "AND");
        expect(andBtn.style.backgroundColor).toBe("#5BE402");
        expect(andBtn.style.fill).toBe("#000");
    });
    
    test('deve configurar padding nos textos dos bits', () => {
        blackLock.openPuzzle();
        
        blackLock.bitTexts.forEach(text => {
            expect(text.padding).toBe(10);
        });
    });
    
    test('deve configurar padding nos botões de operação', () => {
        blackLock.openPuzzle();
        
        const operations = ["AND", "OR", "XOR", "NOT"];
        operations.forEach(op => {
            const btn = blackLock.add.createdObjects.find(obj => obj.text === op);
            expect(btn.padding).toEqual({ x: 10, y: 5 });
        });
    });
});

console.log('Testes unitários para BlackLock.openPuzzle() criados com sucesso!'); 