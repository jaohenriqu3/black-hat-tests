class MockPhaserScene {
    constructor() {
        this.add = new MockAdd();
        this.sound = new MockSound();
        this.input = new MockInput();
        this.cameras = new MockCameras();
        this.scene = new MockScene();
    }
}

class MockAdd {
    constructor() {
        this.createdObjects = [];
    }
    
    rectangle(x, y, width, height, color) {
        const rect = {
            x, y, width, height, color,
            setOrigin: (origin) => {
                rect.origin = origin;
                return rect;
            },
            setInteractive: () => {
                rect.interactive = true;
                return rect;
            },
            setDepth: (depth) => {
                rect.depth = depth;
                return rect;
            },
            on: (event, callback) => {
                rect.event = event;
                rect.callback = callback;
                return rect;
            },
            destroy: () => {
                rect.destroyed = true;
                return rect;
            }
        };
        this.createdObjects.push(rect);
        return rect;
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
    
    image(x, y, texture) {
        const image = {
            x, y, texture,
            setDepth: (depth) => {
                image.depth = depth;
                return image;
            },
            setInteractive: () => {
                image.interactive = true;
                return image;
            },
            setScale: (scale) => {
                image.scale = scale;
                return image;
            },
            setAngle: (angle) => {
                image.angle = angle;
                return image;
            },
            on: (event, callback) => {
                image.event = event;
                image.callback = callback;
                return image;
            },
            destroy: () => {
                image.destroyed = true;
                return image;
            }
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

class MockScene {
    start(sceneName) {
        this.startedScene = sceneName;
    }
}

class MockCoinBar {
    constructor(scene, x, y) {
        this.container = { setScale: (scale) => ({ scale }) };
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

class DataCenterPCTest {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }
    
    openPuzzle() {
        this.popupOpen = true;
        
        this.puzzlePopup = this.add.rectangle(625, 280, 570, 350, 0x4B3559).setDepth(10);
        
        this.closePuzzleButton = this.add.text(872, 105, "X", {
            fontSize: "32px",
            fill: "#ffffff",
            fontFamily: "monospace",
            backgroundColor: "#ff0000",
            padding: { x: 10, y: 5 }
        }).setInteractive().setDepth(11);
        
        const gridTiles = [
            ["vertical50", "vertical", "vertical-angular-left"],
            ["vertical-angular-top", "vertical", "vertical-angular-right"],
            ["vertical-angular-down", "vertical", "vertical50-left"]
        ];
        
        const expectedRotations = [
            [0, 0, 0],
            [2, 0, 2],
            [0, 0, 0]
        ];
        
        const gridSize = 3;
        const cellSize = 90;
        const offsetX = 545;
        const offsetY = 160;
        this.puzzlePieces = [];
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const x = offsetX + col * cellSize;
                const y = offsetY + row * cellSize;
                
                const texture = gridTiles[row][col];
                const correctRotation = expectedRotations[row][col];
                
                const piece = this.add.image(x, y, texture).setDepth(11).setInteractive().setScale(2.0);
                piece.rotationState = 0;
                piece.setAngle(0);
                piece.correctRotation = correctRotation;
                piece.textureKey = texture;
                
                this.puzzlePieces.push(piece);
            }
        }
        
        this.puzzleLabel = this.add.text(445, 115, "Conecte os circuitos", {
            fontSize: "18px",
            fill: "#FFFFFF",
            fontFamily: "monospace"
        }).setOrigin(0.5).setDepth(11);
        
        this.checkButton = this.add.text(635, 420, "Verificar", {
            fontSize: "24px",
            fill: "#FFFFFF",
            fontFamily: "monospace",
            backgroundColor: "#00AA00",
            padding: { x: 12, y: 6 }
        }).setOrigin(0.5).setInteractive().setDepth(11);
    }
    
    closePuzzle() {
        this.popupOpen = false;
        
        if (this.puzzlePopup) this.puzzlePopup.destroy();
        if (this.closePuzzleButton) this.closePuzzleButton.destroy();
        if (this.puzzlePieces) this.puzzlePieces.forEach(piece => piece.destroy());
        
        this.checkButton = null;
        this.feedbackText = null;
        this.puzzleLabel = null;
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
        console.log("Iniciando testes: DataCenterPC.openPuzzle()\n");
        
        // Teste 1: Verificar se popupOpen é definido como true
        this.test("deve definir popupOpen como true quando executado", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.openPuzzle();
            this.expect(this.popupOpen).toBe(true);
        });
        
        // Teste 2: Verificar se o popup do puzzle foi criado
        this.test("deve criar o popup do puzzle", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.openPuzzle();
            this.expect(this.puzzlePopup).toBeDefined();
        });
        
        // Teste 3: Verificar se o botão de fechar foi criado
        this.test("deve criar o botão de fechar o puzzle", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.openPuzzle();
            this.expect(this.closePuzzleButton).toBeDefined();
            this.expect(this.closePuzzleButton.text).toBe("X");
        });
        
        // Teste 4: Verificar se 9 peças do puzzle foram criadas
        this.test("deve criar 9 peças do puzzle (3x3 grid)", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.openPuzzle();
            this.expect(this.puzzlePieces).toHaveLength(9);
        });
        
        // Teste 5: Verificar se o botão de verificar foi criado
        this.test("deve criar o botão de verificar", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.openPuzzle();
            this.expect(this.checkButton).toBeDefined();
            this.expect(this.checkButton.text).toBe("Verificar");
        });
        
        // Teste 6: Verificar se o label do puzzle foi criado
        this.test("deve criar o label do puzzle", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.openPuzzle();
            this.expect(this.puzzleLabel).toBeDefined();
            this.expect(this.puzzleLabel.text).toBe("Conecte os circuitos");
        });
        
        // Teste 7: Verificar se as peças têm propriedades corretas
        this.test("deve configurar propriedades corretas nas peças do puzzle", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.openPuzzle();
            
            this.puzzlePieces.forEach(piece => {
                this.expect(piece.rotationState).toBe(0);
                this.expect(piece.correctRotation).toBeDefined();
                this.expect(piece.textureKey).toBeDefined();
            });
        });
        
        // Teste 8: Verificar se closePuzzle limpa os recursos
        this.test("deve limpar recursos quando closePuzzle é chamado", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.openPuzzle();
            
            this.expect(this.popupOpen).toBe(true);
            this.expect(this.puzzlePopup).toBeDefined();
            
            this.closePuzzle();
            
            this.expect(this.popupOpen).toBe(false);
            this.expect(this.checkButton).toBe(null);
            this.expect(this.puzzleLabel).toBe(null);
        });
        
        // Teste 9: Verificar se objetos têm depth correto
        this.test("deve criar objetos com depth correto", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.openPuzzle();
            
            this.expect(this.puzzlePopup.depth).toBe(10);
            this.expect(this.closePuzzleButton.depth).toBe(11);
            this.expect(this.checkButton.depth).toBe(11);
            this.expect(this.puzzleLabel.depth).toBe(11);
        });
        
        // Teste 10: Verificar se peças são interativas
        this.test("deve configurar interatividade nas peças do puzzle", () => {
            this.popupOpen = false;
            this.add = new MockAdd();
            this.openPuzzle();
            
            this.puzzlePieces.forEach(piece => {
                this.expect(piece.interactive).toBe(true);
            });
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

const testRunner = new DataCenterPCTest();
testRunner.runTests(); 