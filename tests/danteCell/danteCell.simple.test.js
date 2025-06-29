class MockAdd {
    constructor() {
        this.createdObjects = [];
    }
    
    text(x, y, text, style) {
        const textObj = {
            x, y, text, style,
            setOrigin: (origin) => {
                textObj.origin = origin;
                return textObj;
            },
            setInteractive: () => {
                textObj.interactive = true;
                return textObj;
            },
            setDepth: (depth) => {
                textObj.depth = depth;
                return textObj;
            },
            setVisible: (visible) => {
                textObj.visible = visible;
                return textObj;
            },
            setColor: (color) => {
                textObj.color = color;
                return textObj;
            },
            setText: (text) => {
                textObj.text = text;
                return textObj;
            },
            on: (event, callback) => {
                textObj.event = event;
                textObj.callback = callback;
                return textObj;
            },
            destroy: () => {
                textObj.destroyed = true;
                return textObj;
            }
        };
        this.createdObjects.push(textObj);
        return textObj;
    }
    
    container(x, y) {
        const container = {
            x, y,
            add: (child) => {
                if (!container.children) container.children = [];
                container.children.push(child);
                return container;
            },
            destroy: () => {
                container.destroyed = true;
                return container;
            }
        };
        this.createdObjects.push(container);
        return container;
    }
}

class MockCoreBar {
    constructor(scene, x, y) {
        this.container = { setScale: (scale) => ({ scale }) };
    }
    
    loseCore() {
        return { coreLost: true };
    }
    
    getCoreCount() {
        return 3;
    }
}

class MockScene {
    start(sceneName) {
        this.startedScene = sceneName;
    }
}

class MockVisibility {
    constructor() { 
        this.visible = true; 
    }
    setVisible(v) { 
        this.visible = v; 
        return this; 
    }
}

class DanteCellTest {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }
    
    openPuzzle() {
        this.popupOpen = true;
        
        this.puzzleContainer = this.add.container(400, 300);
        
        this.binaryTexts = [];
        this.binarySequence = [0, 1, 0, 1];
        
        for (let i = 0; i < 4; i++) {
            const text = this.add.text(500 + i * 80, 350, this.binarySequence[i].toString(), {
                fill: "#FFFFFF",
                fontFamily: 'monospace',
                fontSize: "24px"
            }).setInteractive().setDepth(11);
            this.binaryTexts.push(text);
        }
        
        this.checkButton = this.add.text(600, 450, "Verificar", {
            fontSize: "20px",
            fill: "#FFFFFF",
            fontFamily: "monospace",
            backgroundColor: "#00AA00",
            padding: { x: 10, y: 5 }
        }).setInteractive().setDepth(11);
        
        this.puzzleMessage = this.add.text(600, 500, "Sequência: 0110", {
            fontSize: "16px",
            fill: "#FFFFFF",
            fontFamily: "monospace"
        }).setDepth(11);
        
        this.closeButton = this.add.text(700, 200, "X", {
            fontSize: "24px",
            fill: "#FFFFFF",
            fontFamily: "monospace",
            backgroundColor: "#FF0000",
            padding: { x: 8, y: 4 }
        }).setInteractive().setDepth(11);
        
        // Ocultar elementos quando puzzle abre
        if (this.titleText) this.titleText.setVisible(false);
        if (this.criptoIcon) this.criptoIcon.setVisible(false);
    }
    
    closePuzzle() {
        this.popupOpen = false;
        
        if (this.puzzleContainer) this.puzzleContainer.destroy();
        
        // Mostrar elementos novamente
        if (this.titleText) this.titleText.setVisible(true);
        if (this.criptoIcon) this.criptoIcon.setVisible(true);
    }
    
    test(description, testFunction) {
        try {
            testFunction();
            this.passed++;
            console.log(`PASSOU: ${description}`);
        } catch (error) {
            this.failed++;
            console.log(`FALHOU: ${description}`);
            console.log(`Erro: ${error.message}`);
        }
    }
    
    expect(actual) {
        return {
            toBe: (expected) => {
                if (actual !== expected) {
                    throw new Error(`Esperado ${expected}, mas recebido ${actual}`);
                }
            },
            toBeDefined: () => {
                if (actual === undefined || actual === null) {
                    throw new Error(`Esperado que fosse definido, mas recebido ${actual}`);
                }
            },
            toHaveLength: (expected) => {
                if (actual.length !== expected) {
                    throw new Error(`Esperado comprimento ${expected}, mas recebido ${actual.length}`);
                }
            }
        };
    }
    
    runTests() {
        console.log("Iniciando testes: DanteCell.openPuzzle()\n");
        
        // Teste 1: Verificar se popupOpen é definido como true
        this.test("deve definir popupOpen como true quando executado", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.openPuzzle();
            this.expect(this.popupOpen).toBe(true);
        });
        
        // Teste 2: Verificar se o container do puzzle foi criado
        this.test("deve criar o container do puzzle", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.openPuzzle();
            this.expect(this.puzzleContainer).toBeDefined();
        });
        
        // Teste 3: Verificar se 4 textos binários foram criados
        this.test("deve criar 4 textos binários", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.openPuzzle();
            this.expect(this.binaryTexts).toHaveLength(4);
        });
        
        // Teste 4: Verificar se a sequência inicial está correta
        this.test("deve inicializar a sequência com [0,1,0,1]", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.openPuzzle();
            this.expect(this.binarySequence).toHaveLength(4);
            this.expect(this.binarySequence[0]).toBe(0);
            this.expect(this.binarySequence[1]).toBe(1);
            this.expect(this.binarySequence[2]).toBe(0);
            this.expect(this.binarySequence[3]).toBe(1);
        });
        
        // Teste 5: Verificar se o botão de verificar foi criado
        this.test("deve criar o botão de verificar", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.openPuzzle();
            this.expect(this.checkButton).toBeDefined();
            this.expect(this.checkButton.text).toBe("Verificar");
        });
        
        // Teste 6: Verificar se a mensagem do puzzle foi criada
        this.test("deve criar a mensagem do puzzle", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.openPuzzle();
            this.expect(this.puzzleMessage).toBeDefined();
            this.expect(this.puzzleMessage.text).toBe("Sequência: 0110");
        });
        
        // Teste 7: Verificar se o botão de fechar foi criado
        this.test("deve criar o botão de fechar", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.openPuzzle();
            this.expect(this.closeButton).toBeDefined();
            this.expect(this.closeButton.text).toBe("X");
        });
        
        // Teste 8: Verificar se titleText e criptoIcon são ocultados
        this.test("deve ocultar titleText e criptoIcon quando o puzzle abre", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.titleText = new MockVisibility();
            this.criptoIcon = new MockVisibility();
            this.openPuzzle();
            this.expect(this.titleText.visible).toBe(false);
            this.expect(this.criptoIcon.visible).toBe(false);
        });
        
        // Teste 9: Verificar se closePuzzle limpa os recursos
        this.test("deve limpar recursos quando closePuzzle é chamado", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.openPuzzle();
            this.expect(this.popupOpen).toBe(true);
            this.expect(this.puzzleContainer).toBeDefined();
            this.closePuzzle();
            this.expect(this.popupOpen).toBe(false);
            this.expect(this.puzzleContainer.destroyed).toBe(true);
        });
        
        // Teste 10: Verificar se titleText e criptoIcon são mostrados novamente
        this.test("deve mostrar titleText e criptoIcon novamente após fechar", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.titleText = new MockVisibility();
            this.criptoIcon = new MockVisibility();
            this.openPuzzle();
            this.closePuzzle();
            this.expect(this.titleText.visible).toBe(true);
            this.expect(this.criptoIcon.visible).toBe(true);
        });
        
        console.log(`RESULTADO DOS TESTES:`);
        console.log(`Testes OK: ${this.passed}`);
        console.log(`Testes falhos: ${this.failed}`);
        console.log(`Total: ${this.passed + this.failed}`);
        
        if (this.failed === 0) {
            console.log(`Testes aprovados`);
        } else {
            console.log(`Alguns testes falharam.`);
        }
    }
}

const testRunner = new DanteCellTest();
testRunner.runTests(); 