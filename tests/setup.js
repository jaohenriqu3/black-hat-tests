global.Phaser = {
    Scene: class MockScene {
        constructor() {
            this.add = {
                rectangle: jest.fn().mockReturnValue({
                    setOrigin: jest.fn().mockReturnThis(),
                    setInteractive: jest.fn().mockReturnThis(),
                    setDepth: jest.fn().mockReturnThis(),
                    on: jest.fn().mockReturnThis(),
                    destroy: jest.fn()
                }),
                text: jest.fn().mockReturnValue({
                    setOrigin: jest.fn().mockReturnThis(),
                    setInteractive: jest.fn().mockReturnThis(),
                    setDepth: jest.fn().mockReturnThis(),
                    on: jest.fn().mockReturnThis(),
                    destroy: jest.fn()
                }),
                image: jest.fn().mockReturnValue({
                    setDepth: jest.fn().mockReturnThis(),
                    setInteractive: jest.fn().mockReturnThis(),
                    setScale: jest.fn().mockReturnThis(),
                    setAngle: jest.fn().mockReturnThis(),
                    on: jest.fn().mockReturnThis(),
                    destroy: jest.fn()
                })
            };
            this.sound = {
                add: jest.fn().mockReturnValue({
                    play: jest.fn(),
                    stop: jest.fn()
                })
            };
            this.input = {
                keyboard: {
                    addKey: jest.fn().mockReturnValue({
                        isDown: false
                    })
                }
            };
            this.cameras = {
                main: {
                    fadeOut: jest.fn(),
                    once: jest.fn()
                }
            };
            this.scene = {
                start: jest.fn()
            };
        }
    },
    Input: {
        Keyboard: {
            KeyCodes: {
                E: 'E'
            },
            JustDown: jest.fn()
        }
    }
};

// DOM
global.document = {
    createElement: jest.fn(),
    getElementById: jest.fn(),
    querySelector: jest.fn()
};

global.window = {
    lastScene: null
};


jest.mock('./black-hat/src/components/coinBar/coinBar.js', () => {
    return class MockCoinBar {
        constructor(scene, x, y) {
            this.container = { setScale: jest.fn() };
        }
    };
});

jest.mock('./black-hat/src/components/coreBar/coreBar.js', () => {
    return class MockCoreBar {
        constructor(scene, x, y) {
            this.container = { setScale: jest.fn() };
        }
        loseCore() {
            return { coreLost: true };
        }
        getCoreCount() {
            return 3;
        }
    };
});

jest.mock('./black-hat/src/state/gameState.js', () => ({
    getChapter: jest.fn().mockReturnValue(1)
}));

jest.mock('./black-hat/src/components/systemMessage/systemMessage.js', () => ({
    show: jest.fn()
}));

global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
}; 