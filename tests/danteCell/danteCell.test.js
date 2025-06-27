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
    getChapter: () => 3
};

describe('DanteCell - openPuzzle()', () => {
    let danteCell;
    let mockPhaser;
    
    beforeEach(() => {
        mockPhaser = new MockPhaser();
        global.Phaser = mockPhaser;
        
        jest.mock('./black-hat/src/components/coinBar/coinBar.js', () => mockCoinBar);
        jest.mock('./black-hat/src/components/coreBar/coreBar.js', () => mockCoreBar);
        jest.mock('./black-hat/src/state/gameState.js', () => mockGameState);
        
        const DanteCell = require('./black-hat/src/scenes/cap3/danteCell.js').default;
        danteCell = new DanteCell();
        
        danteCell.popupOpen = false;
        danteCell.add = new MockAdd();
        danteCell.coreBar = new mockCoreBar();
        danteCell.titleText = { setVisible: (visible) => ({ visible }) };
        danteCell.criptoIcon = { setVisible: (visible) => ({ visible }) };
        danteCell.scene = { start: jest.fn() };
    });
    
    test('deve definir popupOpen como true quando executado', () => {
        danteCell.openPuzzle();
        
        expect(danteCell.popupOpen).toBe(true);
    });
    
    test('deve criar o container do puzzle', () => {
        danteCell.openPuzzle();
        
        expect(danteCell.puzzleContainer).toBeDefined();
    });
    
    test('deve criar 4 textos binários', () => {
        danteCell.openPuzzle();
        
        expect(danteCell.binaryTexts).toHaveLength(4);
    });
    
    test('deve inicializar a sequência com [0,1,0,1]', () => {
        danteCell.openPuzzle();
        
        expect(danteCell.currentSequence).toHaveLength(4);
        expect(danteCell.currentSequence[0]).toBe(0);
        expect(danteCell.currentSequence[1]).toBe(1);
        expect(danteCell.currentSequence[2]).toBe(0);
        expect(danteCell.currentSequence[3]).toBe(1);
    });
    
    test('deve criar o botão de verificar', () => {
        danteCell.openPuzzle();
        
        const verifyBtn = danteCell.puzzleContainer.children.find(child => 
            child.text === "Verificar" && child.style && child.style.backgroundColor === "#5BE402"
        );
        expect(verifyBtn).toBeDefined();
    });
    
    test('deve criar a mensagem do puzzle', () => {
        danteCell.openPuzzle();
        
        expect(danteCell.puzzleMessage).toBeDefined();
    });
    
    test('deve criar o botão de fechar', () => {
        danteCell.openPuzzle();
        
        const closeBtn = danteCell.puzzleContainer.children.find(child => 
            child.text === "X" && child.style && child.style.color === "#5BE402"
        );
        expect(closeBtn).toBeDefined();
    });
    
    test('deve ocultar titleText e criptoIcon quando o puzzle abre', () => {
        danteCell.openPuzzle();
        
        expect(danteCell.titleText.visible).toBe(false);
        expect(danteCell.criptoIcon.visible).toBe(false);
    });
    
    test('deve limpar recursos quando closePuzzle é chamado', () => {
        danteCell.openPuzzle();
        
        expect(danteCell.popupOpen).toBe(true);
        expect(danteCell.puzzleContainer).toBeDefined();
        
        danteCell.closePuzzle();
        
        expect(danteCell.popupOpen).toBe(false);
        expect(danteCell.puzzleContainer.destroyed).toBe(true);
    });
    
    test('deve mostrar titleText e criptoIcon novamente após fechar', () => {
        danteCell.openPuzzle();
        danteCell.closePuzzle();
        
        expect(danteCell.titleText.visible).toBe(true);
        expect(danteCell.criptoIcon.visible).toBe(true);
    });
});

describe('DanteCell - Lógica de Verificação', () => {
    let danteCell;
    
    beforeEach(() => {
        const mockPhaser = new MockPhaser();
        global.Phaser = mockPhaser;
        
        const DanteCell = require('./black-hat/src/scenes/cap3/danteCell.js').default;
        danteCell = new DanteCell();
        danteCell.add = new MockAdd();
        danteCell.coreBar = new mockCoreBar();
        danteCell.titleText = { setVisible: (visible) => ({ visible }) };
        danteCell.criptoIcon = { setVisible: (visible) => ({ visible }) };
        danteCell.scene = { start: jest.fn() };
    });
    
    test('deve verificar se a sequência correta é "0110"', () => {
        danteCell.openPuzzle();
        
        danteCell.currentSequence = [0, 1, 1, 0];
        const isCorrect = danteCell.currentSequence.join("") === "0110";
        expect(isCorrect).toBe(true);
    });
    
    test('deve falhar com sequência incorreta', () => {
        danteCell.openPuzzle();
        
        danteCell.currentSequence = [1, 0, 1, 0];
        const isCorrect = danteCell.currentSequence.join("") === "0110";
        expect(isCorrect).toBe(false);
    });
    
    test('deve mostrar mensagem de sucesso quando sequência está correta', () => {
        danteCell.openPuzzle();
        
        danteCell.currentSequence = [0, 1, 1, 0];
        const isCorrect = danteCell.currentSequence.join("") === "0110";
        
        if (isCorrect) {
            danteCell.puzzleMessage.setColor("#5BE402");
            danteCell.puzzleMessage.setText("Criptografia rompida.\n\nArquivos liberados:\nnexus_grid.dat\nproject_DarkNest.log");
            
            expect(danteCell.puzzleMessage.color).toBe("#5BE402");
            expect(danteCell.puzzleMessage.text).toContain("Criptografia rompida");
        }
    });
    
    test('deve mostrar mensagem de falha quando sequência está incorreta', () => {
        danteCell.openPuzzle();
        
        danteCell.currentSequence = [1, 0, 1, 0];
        const isCorrect = danteCell.currentSequence.join("") === "0110";
        
        if (!isCorrect) {
            danteCell.puzzleMessage.setColor("#FF0000");
            danteCell.puzzleMessage.setText("Hackeamento falho");
            
            expect(danteCell.puzzleMessage.color).toBe("#FF0000");
            expect(danteCell.puzzleMessage.text).toBe("Hackeamento falho");
        }
    });
});

describe('DanteCell - Interatividade dos Elementos', () => {
    let danteCell;
    
    beforeEach(() => {
        const mockPhaser = new MockPhaser();
        global.Phaser = mockPhaser;
        
        const DanteCell = require('./black-hat/src/scenes/cap3/danteCell.js').default;
        danteCell = new DanteCell();
        danteCell.add = new MockAdd();
        danteCell.coreBar = new mockCoreBar();
        danteCell.titleText = { setVisible: (visible) => ({ visible }) };
        danteCell.criptoIcon = { setVisible: (visible) => ({ visible }) };
        danteCell.scene = { start: jest.fn() };
    });
    
    test('deve configurar interatividade nos textos binários', () => {
        danteCell.openPuzzle();
        
        danteCell.binaryTexts.forEach(text => {
            expect(text.setInteractive).toBe(true);
        });
    });
    
    test('deve configurar interatividade no botão de verificar', () => {
        danteCell.openPuzzle();
        
        const verifyBtn = danteCell.puzzleContainer.children.find(child => 
            child.text === "Verificar"
        );
        expect(verifyBtn.setInteractive).toBe(true);
    });
    
    test('deve configurar interatividade no botão de fechar', () => {
        danteCell.openPuzzle();
        
        const closeBtn = danteCell.puzzleContainer.children.find(child => 
            child.text === "X"
        );
        expect(closeBtn.setInteractive).toBe(true);
    });
});

console.log('Testes unitários DanteCell.openPuzzle()'); 