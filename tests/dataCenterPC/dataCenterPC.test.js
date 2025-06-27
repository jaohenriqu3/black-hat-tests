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
    
    rectangle(x, y, width, height, color) {
        const rect = {
            x, y, width, height, color,
            setOrigin: (origin) => ({ origin }),
            setInteractive: () => ({ setInteractive: true }),
            setDepth: (depth) => ({ depth }),
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
            setAngle: (angle) => ({ angle }),
            on: (event, callback) => ({ event, callback }),
            destroy: () => ({ destroyed: true })
        };
        this.createdObjects.push(image);
        return image;
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
    getChapter: () => 1
};

const mockSystemMessage = {
    show: (message) => ({ message })
};

describe('DataCenterPC - openPuzzle()', () => {
    let dataCenterPC;
    let mockPhaser;
    
    beforeEach(() => {
        mockPhaser = new MockPhaser();
        global.Phaser = mockPhaser;
        
        jest.mock('./black-hat/src/components/coinBar/coinBar.js', () => mockCoinBar);
        jest.mock('./black-hat/src/components/coreBar/coreBar.js', () => mockCoreBar);
        jest.mock('./black-hat/src/state/gameState.js', () => mockGameState);
        jest.mock('./black-hat/src/components/systemMessage/systemMessage.js', () => mockSystemMessage);
        
        const DataCenterPC = require('./black-hat/src/scenes/cap1/dataCenterPC.js').default;
        dataCenterPC = new DataCenterPC();
        
        dataCenterPC.popupOpen = false;
        dataCenterPC.add = new MockAdd();
        dataCenterPC.coreBar = new mockCoreBar();
    });
    
    test('deve criar o popup do puzzle quando chamado', () => {
        dataCenterPC.openPuzzle();
        
        expect(dataCenterPC.popupOpen).toBe(true);
        expect(dataCenterPC.puzzlePopup).toBeDefined();
    });
    
    test('deve criar o botão de fechar o puzzle', () => {
        dataCenterPC.openPuzzle();
        
        expect(dataCenterPC.closePuzzleButton).toBeDefined();
        expect(dataCenterPC.closePuzzleButton.text).toBe('X');
    });
    
    test('deve criar 9 peças do puzzle (3x3 grid)', () => {
        dataCenterPC.openPuzzle();
        
        expect(dataCenterPC.puzzlePieces).toHaveLength(9);
    });
    
    test('deve configurar as propriedades corretas das peças do puzzle', () => {
        dataCenterPC.openPuzzle();
        
        dataCenterPC.puzzlePieces.forEach(piece => {
            expect(piece.rotationState).toBe(0);
            expect(piece.correctRotation).toBeDefined();
            expect(piece.textureKey).toBeDefined();
        });
    });
    
    test('deve criar o botão de verificar', () => {
        dataCenterPC.openPuzzle();
        
        expect(dataCenterPC.checkButton).toBeDefined();
        expect(dataCenterPC.checkButton.text).toBe('Verificar');
    });
    
    test('deve criar o label do puzzle', () => {
        dataCenterPC.openPuzzle();
        
        expect(dataCenterPC.puzzleLabel).toBeDefined();
        expect(dataCenterPC.puzzleLabel.text).toBe('Conecte os circuitos');
    });
    
    test('deve definir popupOpen como true quando executado', () => {
        expect(dataCenterPC.popupOpen).toBe(false);
        
        dataCenterPC.openPuzzle();
        
        expect(dataCenterPC.popupOpen).toBe(true);
    });
    
    test('deve criar objetos com depth correto', () => {
        dataCenterPC.openPuzzle();
        
        expect(dataCenterPC.puzzlePopup.depth).toBe(10);
        expect(dataCenterPC.closePuzzleButton.depth).toBe(11);
        expect(dataCenterPC.checkButton.depth).toBe(11);
        expect(dataCenterPC.puzzleLabel.depth).toBe(11);
    });
    
    test('deve configurar interatividade nas peças do puzzle', () => {
        dataCenterPC.openPuzzle();
        
        dataCenterPC.puzzlePieces.forEach(piece => {
            expect(piece.setInteractive).toBe(true);
        });
    });
    
    test('deve configurar escala correta nas peças do puzzle', () => {
        dataCenterPC.openPuzzle();
        
        dataCenterPC.puzzlePieces.forEach(piece => {
            expect(piece.scale).toBe(2.0);
        });
    });
});

describe('DataCenterPC - Verificação do Puzzle', () => {
    let dataCenterPC;
    
    beforeEach(() => {
        const mockPhaser = new MockPhaser();
        global.Phaser = mockPhaser;
        
        const DataCenterPC = require('./black-hat/src/scenes/cap1/dataCenterPC.js').default;
        dataCenterPC = new DataCenterPC();
        dataCenterPC.add = new MockAdd();
        dataCenterPC.coreBar = new mockCoreBar();
    });
    
    test('deve mostrar feedback de sucesso quando todas as peças estão corretas', () => {
        dataCenterPC.openPuzzle();
        
        dataCenterPC.puzzlePieces.forEach(piece => {
            piece.rotationState = piece.correctRotation;
        });
        
        const checkCallback = dataCenterPC.checkButton.callback;
        checkCallback();
        
        expect(dataCenterPC.feedbackText).toBeDefined();
        expect(dataCenterPC.feedbackText.text).toBe('Hackeamento bem sucedido');
    });
    
    test('deve mostrar feedback de falha quando as peças estão incorretas', () => {
        dataCenterPC.openPuzzle();
        
        dataCenterPC.puzzlePieces[0].rotationState = 1; // Incorreto
        
        const checkCallback = dataCenterPC.checkButton.callback;
        checkCallback();
        
        expect(dataCenterPC.feedbackText).toBeDefined();
        expect(dataCenterPC.feedbackText.text).toBe('Hackeamento falho');
    });
});

describe('DataCenterPC - Limpeza de Recursos', () => {
    let dataCenterPC;
    
    beforeEach(() => {
        const mockPhaser = new MockPhaser();
        global.Phaser = mockPhaser;
        
        const DataCenterPC = require('./black-hat/src/scenes/cap1/dataCenterPC.js').default;
        dataCenterPC = new DataCenterPC();
        dataCenterPC.add = new MockAdd();
        dataCenterPC.coreBar = new mockCoreBar();
    });
    
    test('deve limpar todos os objetos quando closePuzzle é chamado', () => {
        dataCenterPC.openPuzzle();
        
        expect(dataCenterPC.puzzlePopup).toBeDefined();
        expect(dataCenterPC.closePuzzleButton).toBeDefined();
        expect(dataCenterPC.puzzlePieces).toHaveLength(9);
        expect(dataCenterPC.checkButton).toBeDefined();
        expect(dataCenterPC.puzzleLabel).toBeDefined();
        
        dataCenterPC.closePuzzle();
        
        expect(dataCenterPC.popupOpen).toBe(false);
        
        expect(dataCenterPC.puzzlePopup.destroyed).toBe(true);
        expect(dataCenterPC.closePuzzleButton.destroyed).toBe(true);
        expect(dataCenterPC.checkButton).toBeNull();
        expect(dataCenterPC.puzzleLabel).toBeNull();
    });
});

console.log('Testes unitários para DataCenterPC.openPuzzle() criados com sucesso!'); 