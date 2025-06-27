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
    
    rectangle(x, y, width, height, color, alpha) {
        const rect = {
            x, y, width, height, color, alpha,
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
            setStrokeStyle: (width, color) => {
                rect.strokeWidth = width;
                rect.strokeColor = color;
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
            setPadding: (padding) => {
                textObj.padding = padding;
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
            setVisible: (visible) => {
                image.visible = visible;
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

class BlackLockTest {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }
    
    openPuzzle() {
        this.puzzleBackground = this.add.rectangle(699, 437, 280, 365, 0x00000).setOrigin(0.5);
     
        const targetKey = "1101";
        this.add.text(640, 270, `Chave: ${targetKey}`, {
            fill: "#5BE402", fontFamily: 'monospace', fontSize: "20px"
        }).setDepth(11); 

        this.bitBlocks = ["0010", "0111"];
        this.bitTexts = [];

        this.bitBlocks.forEach((bits, index) => {
            const text = this.add.text(665, 310 + index * 40, bits, {
                fill: "#FFFFFF", fontFamily: 'monospace', fontSize: "20px", backgroundColor: "#000"
            }).setPadding(10).setDepth(11);
            this.bitTexts.push(text);
        });

        this.resultText = this.add.text(630, 400, "Resultado: ----", {
            fill: "#FFD700", fontFamily: 'monospace', fontSize: "18px"
        }).setDepth(11);

        const operations = ["AND", "OR", "XOR", "NOT"];
        operations.forEach((op, i) => {
            const btn = this.add.text(590 + (i * 60), 450, op, {
                fill: "#000", fontFamily: 'monospace', fontSize: "16px",
                backgroundColor: "#5BE402", padding: { x: 10, y: 5 }
            }).setInteractive().setDepth(11);

            btn.on("pointerdown", () => {
                this.applyOperation(op, targetKey);
            });
        });
    }
    
    applyOperation(op, targetKey) {
        let [a, b] = this.bitBlocks;
        let result = "";

        switch (op) {
            case "AND":
                for (let i = 0; i < 4; i++) result += a[i] & b[i];
                break;
            case "OR":
                for (let i = 0; i < 4; i++) result += a[i] | b[i];
                break;
            case "XOR":
                for (let i = 0; i < 4; i++) result += a[i] ^ b[i];
                break;
            case "NOT":
                for (let i = 0; i < 4; i++) result += a[i] === "1" ? "0" : "1";
                break;
        }

        this.resultText.setText("Resultado: " + result);

        if (result === targetKey) {
            this.true = this.add.text(620, 520, "Porta Desbloqueada", {
                fill: "#00FF00", fontFamily: 'monospace', fontSize: "18px"
            }).setDepth(11).setVisible(true);

            this.nextBtn = this.add.text(700, 570, "Abrir", {
                fontSize: "18px",
                fontFamily: "monospace",
                backgroundColor: "#5BE402",
                color: "#000000",
                padding: { x: 10, y: 5 },
            }).setOrigin(0.5).setInteractive().setVisible(true);

            this.nextBtn.on("pointerdown", () => {
                this.cameras.main.fadeOut(3000, 0, 0, 0); 
                this.cameras.main.once("camerafadeoutcomplete", () => {
                    this.scene.start("BlackOffice");
                });
            });
        } else { 
            this.coreBar.loseCore(); 

            if (this.coreBar.getCoreCount() <= 0) {
                window.lastScene = 'BlackLock'
                this.scene.start("Chapter1GameOver"); 
            }

            this.false = this.add.text(640, 520, "Acesso Negado", {
                fill: "#E40202", fontFamily: 'monospace', fontSize: "18px"
            }).setDepth(11).setVisible(true);
        }
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
            },
            toBeGreaterThan: (expected) => {
                if (actual <= expected) {
                    throw new Error(`Esperado maior que ${expected}, mas recebido ${actual}`);
                }
            }
        };
    }
    
    runTests() {
        console.log("Iniciando testes: BlackLock.openPuzzle()\n");
        
        // Teste 1: Verificar se o background do puzzle foi criado
        this.test("deve criar o background do puzzle", () => {
            this.add = new MockAdd();
            this.openPuzzle();
            this.expect(this.puzzleBackground).toBeDefined();
        });
        
        // Teste 2: Verificar se a chave alvo foi criada
        this.test("deve criar o texto da chave alvo", () => {
            this.add = new MockAdd();
            this.openPuzzle();
            
            const keyText = this.add.createdObjects.find(obj => 
                obj.text && obj.text.includes("Chave: 1101")
            );
            this.expect(keyText).toBeDefined();
        });
        
        // Teste 3: Verificar se os blocos de bits foram criados
        this.test("deve criar os blocos de bits", () => {
            this.add = new MockAdd();
            this.openPuzzle();
            this.expect(this.bitBlocks).toHaveLength(2);
            this.expect(this.bitBlocks[0]).toBe("0010");
            this.expect(this.bitBlocks[1]).toBe("0111");
        });
        
        // Teste 4: Verificar se os textos dos bits foram criados
        this.test("deve criar os textos dos bits", () => {
            this.add = new MockAdd();
            this.openPuzzle();
            this.expect(this.bitTexts).toHaveLength(2);
        });
        
        // Teste 5: Verificar se o texto de resultado foi criado
        this.test("deve criar o texto de resultado", () => {
            this.add = new MockAdd();
            this.openPuzzle();
            this.expect(this.resultText).toBeDefined();
        });
        
        // Teste 6: Verificar se os botões de operação foram criados
        this.test("deve criar os botões de operação", () => {
            this.add = new MockAdd();
            this.openPuzzle();
            
            const operations = ["AND", "OR", "XOR", "NOT"];
            operations.forEach(op => {
                const btn = this.add.createdObjects.find(obj => 
                    obj.text === op && obj.style && obj.style.backgroundColor === "#5BE402"
                );
                this.expect(btn).toBeDefined();
            });
        });
        
        // Teste 7: Verificar se os botões têm interatividade
        this.test("deve configurar interatividade nos botões", () => {
            this.add = new MockAdd();
            this.openPuzzle();
            
            const operations = ["AND", "OR", "XOR", "NOT"];
            operations.forEach(op => {
                const btn = this.add.createdObjects.find(obj => obj.text === op);
                this.expect(btn.interactive).toBe(true);
            });
        });
        
        // Teste 8: Verificar se os elementos têm depth correto
        this.test("deve configurar depth correto nos elementos", () => {
            this.add = new MockAdd();
            this.openPuzzle();

            const elementsWithDepth = this.add.createdObjects.filter(obj => obj.depth === 11);
            this.expect(elementsWithDepth.length).toBeGreaterThan(0);
        });
        
        // Teste 9: Verificar lógica AND
        this.test("deve calcular operação AND corretamente", () => {
            this.add = new MockAdd();
            this.coreBar = new MockCoreBar();
            this.scene = new MockScene();
            this.openPuzzle();
            
            this.applyOperation("AND", "1101");
            this.expect(this.resultText.text).toBe("Resultado: 0010");
        });
        
        // Teste 10: Verificar lógica OR
        this.test("deve calcular operação OR corretamente", () => {
            this.add = new MockAdd();
            this.coreBar = new MockCoreBar();
            this.scene = new MockScene();
            this.openPuzzle();
            
            this.applyOperation("OR", "1101");
            this.expect(this.resultText.text).toBe("Resultado: 0111");
        });
        
        // Teste 11: Verificar lógica XOR
        this.test("deve calcular operação XOR corretamente", () => {
            this.add = new MockAdd();
            this.coreBar = new MockCoreBar();
            this.scene = new MockScene();
            this.openPuzzle();
            
            this.applyOperation("XOR", "1101");
            this.expect(this.resultText.text).toBe("Resultado: 0101");
        });
        
        // Teste 12: Verificar lógica NOT
        this.test("deve calcular operação NOT corretamente", () => {
            this.add = new MockAdd();
            this.coreBar = new MockCoreBar();
            this.scene = new MockScene();
            this.openPuzzle();
            
            this.applyOperation("NOT", "1101");
            this.expect(this.resultText.text).toBe("Resultado: 1101");
        });
        
        // Teste 13: Verificar sucesso quando resultado correto
        this.test("deve mostrar sucesso quando resultado está correto", () => {
            this.add = new MockAdd();
            this.coreBar = new MockCoreBar();
            this.scene = new MockScene();
            this.openPuzzle();
            
            this.resultText.setText("Resultado: 1101");
            this.applyOperation("AND", "1101");
            
            this.expect(this.true).toBeDefined();
            this.expect(this.nextBtn).toBeDefined();
        });
        
        // Teste 14: Verificar falha quando resultado incorreto
        this.test("deve mostrar falha quando resultado está incorreto", () => {
            this.add = new MockAdd();
            this.coreBar = new MockCoreBar();
            this.scene = new MockScene();
            this.openPuzzle();
            
            this.resultText.setText("Resultado: 0000");
            this.applyOperation("AND", "1101");
            
            this.expect(this.false).toBeDefined();
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

const testRunner = new BlackLockTest();
testRunner.runTests(); 