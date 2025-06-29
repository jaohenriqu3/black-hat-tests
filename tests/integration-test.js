const fs = require('fs');
const path = require('path');

function print(message) {
    console.log(message);
}

function printHeader(title) {
    console.log('\n' + '='.repeat(80));
    print(`INTEGRAÇÃO: ${title}`);
    console.log('='.repeat(80));
}

function printResult(testName, success, details = '') {
    const status = success ? 'PASSOU' : 'FALHOU';
    
    print(`\n${status}: ${testName}`);
    if (details) {
        print(`   Detalhes: ${details}`);
    }
}

function extractImports(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*\s+from\s+)?['"`]([^'"`]+)['"`]/g;
        const imports = [];
        let match;
        
        while ((match = importRegex.exec(content)) !== null) {
            imports.push(match[1]);
        }
        
        return imports;
    } catch (error) {
        return [];
    }
}

function fileExists(filePath) {
    return fs.existsSync(filePath);
}

function validateImport(importPath, baseDir) {
    const cleanPath = importPath.replace(/\.js$/, '');
    
    const possiblePaths = [
        path.join(baseDir, cleanPath + '.js'),
        path.join(baseDir, cleanPath + '/index.js'),
        path.join(baseDir, cleanPath)
    ];
    
    return possiblePaths.some(p => fileExists(p));
}

function analyzeScene(scenePath, sceneName) {
    const imports = extractImports(scenePath);
    const baseDir = path.dirname(scenePath);
    const results = {
        total: imports.length,
        valid: 0,
        invalid: [],
        details: []
    };
    
    imports.forEach(importPath => {
        const isValid = validateImport(importPath, baseDir);
        if (isValid) {
            results.valid++;
            results.details.push(`VALID ${importPath}`);
        } else {
            results.invalid.push(importPath);
            results.details.push(`INVALID ${importPath}`);
        }
    });
    
    return results;
}

function checkSceneCommunication() {
    const scenesDir = 'black-hat/src/scenes';
    const scenes = {
        cap1: ['dataCenter.js', 'dataCenterPC.js', 'doodle.js'],
        cap2: ['ibodelfi.js', 'iboOffice.js'],
        cap3: ['cassinoOffice.js', 'danteCell.js'],
        cap4: ['corvusPC.js', 'blackNest.js', 'blackOffice.js', 'blackLock.js']
    };
    
    const cutscenesDir = 'black-hat/src/scenes/cutscenes';
    const cutscenes = {
        cap1: ['cap1-cutscene.js', 'cap1-gameover.js', 'tutorialcut.js', 'cap1-corvus.js'],
        cap2: [], // Adicionar quando existir
        cap3: [], // Adicionar quando existir
        cap4: []  // Adicionar quando existir
    };
    
    const screensDir = 'black-hat/src/screens';
    const screens = ['initialScreen.js', 'menuScreen.js', 'dantePC.js', 'initial.js', 'cassinoGame.js', 'cassinoPC.js'];
    
    const results = {
        scenes: {},
        cutscenes: {},
        screens: {},
        communication: {
            scenesToCutscenes: 0,
            scenesToScreens: 0,
            cutscenesToScenes: 0,
            screensToScenes: 0
        }
    };
    
    Object.keys(scenes).forEach(cap => {
        results.scenes[cap] = {};
        scenes[cap].forEach(sceneFile => {
            const scenePath = path.join(scenesDir, cap, sceneFile);
            if (fileExists(scenePath)) {
                results.scenes[cap][sceneFile] = analyzeScene(scenePath, `${cap}/${sceneFile}`);
            }
        });
    });
    
    Object.keys(cutscenes).forEach(cap => {
        results.cutscenes[cap] = {};
        cutscenes[cap].forEach(cutsceneFile => {
            const cutscenePath = path.join(cutscenesDir, cap, cutsceneFile);
            if (fileExists(cutscenePath)) {
                results.cutscenes[cap][cutsceneFile] = analyzeScene(cutscenePath, `cutscenes/${cap}/${cutsceneFile}`);
            }
        });
    });
    
    results.screens = {};
    screens.forEach(screenFile => {
        const screenPath = path.join(screensDir, screenFile);
        if (fileExists(screenPath)) {
            results.screens[screenFile] = analyzeScene(screenPath, `screens/${screenFile}`);
        }
    });
    
    return results;
}

function checkSceneTransitions() {
    const transitions = {
        'TelaInicial': ['Initial'],
        'Initial': ['Doodle'],
        'Doodle': ['DataCenter'],
        'DataCenter': ['DataCenterPC', 'Doodle'],
        'DataCenterPC': ['DataCenter'],
        'IboDelfi': ['IboOffice'],
        'IboOffice': ['IboDelfi'],
        'CassinoOffice': ['DanteCell'],
        'DanteCell': ['Chapter1GameOver', 'BlackOffice'],
        'BlackLock': ['BlackOffice', 'Chapter1GameOver'],
        'BlackOffice': ['BlackNest'],
        'BlackNest': ['Chapter1GameOver'],
        'Chapter1Cutscene': ['Doodle'],
        'Chapter1GameOver': []
    };
    
    const results = {
        total: 0,
        valid: 0,
        invalid: [],
        details: []
    };
    
    Object.keys(transitions).forEach(fromScene => {
        transitions[fromScene].forEach(toScene => {
            results.total++;
            
            const sceneExists = checkSceneExists(toScene);
            
            if (sceneExists) {
                results.valid++;
                results.details.push(`VALID ${fromScene} -> ${toScene}`);
            } else {
                results.invalid.push(`${fromScene} -> ${toScene}`);
                results.details.push(`INVALID ${fromScene} -> ${toScene} (cena não encontrada)`);
            }
        });
    });
    
    return results;
}

function checkSceneExists(sceneName) {
    const sceneFiles = [
        'black-hat/src/screens/initialScreen.js',
        'black-hat/src/screens/initial.js',
        'black-hat/src/scenes/cap1/doodle.js',
        'black-hat/src/scenes/cap1/dataCenter.js',
        'black-hat/src/scenes/cap1/dataCenterPC.js',
        'black-hat/src/scenes/cap2/ibodelfi.js',
        'black-hat/src/scenes/cap2/iboOffice.js',
        'black-hat/src/scenes/cap3/cassinoOffice.js',
        'black-hat/src/scenes/cap3/danteCell.js',
        'black-hat/src/scenes/cap4/blackLock.js',
        'black-hat/src/scenes/cap4/blackOffice.js',
        'black-hat/src/scenes/cap4/blackNest.js',
        'black-hat/src/scenes/cutscenes/cap1/cap1-cutscene.js',
        'black-hat/src/scenes/cutscenes/cap1/cap1-gameover.js'
    ];
    
    return sceneFiles.some(file => {
        if (fileExists(file)) {
            const content = fs.readFileSync(file, 'utf8');
            return content.includes(`super("${sceneName}")`);
        }
        return false;
    });
}

function runIntegrationTest() {
    printHeader('TESTE DE INTEGRAÇÃO - COMUNICAÇÃO ENTRE CENAS');
    
    const startTime = Date.now();
    
    print('\n1. ANALISANDO IMPORTS E DEPENDÊNCIAS');
    const communicationResults = checkSceneCommunication();
    
    let totalImports = 0;
    let validImports = 0;
    let invalidImports = 0;
    
    Object.keys(communicationResults.scenes).forEach(cap => {
        Object.keys(communicationResults.scenes[cap]).forEach(scene => {
            const result = communicationResults.scenes[cap][scene];
            totalImports += result.total;
            validImports += result.valid;
            invalidImports += result.invalid.length;
        });
    });
    
    Object.keys(communicationResults.cutscenes).forEach(cap => {
        Object.keys(communicationResults.cutscenes[cap]).forEach(cutscene => {
            const result = communicationResults.cutscenes[cap][cutscene];
            totalImports += result.total;
            validImports += result.valid;
            invalidImports += result.invalid.length;
        });
    });
    
    Object.keys(communicationResults.screens).forEach(screen => {
        const result = communicationResults.screens[screen];
        totalImports += result.total;
        validImports += result.valid;
        invalidImports += result.invalid.length;
    });
    
    printResult('Análise de imports', invalidImports === 0, 
        `${validImports}/${totalImports} imports válidos`);
    
    if (invalidImports > 0) {
        print(`   Imports inválidos encontrados: ${invalidImports}`);
    }
    
    print('\n2. VERIFICANDO TRANSIÇÕES DE CENA');
    const transitionResults = checkSceneTransitions();
    
    printResult('Transições de cena', transitionResults.invalid.length === 0,
        `${transitionResults.valid}/${transitionResults.total} transições válidas`);
    
    if (transitionResults.invalid.length > 0) {
        print(`   Transições inválidas: ${transitionResults.invalid.join(', ')}`);
    }
    
    print('\n3. VERIFICANDO ESTRUTURA DE PASTAS');
    
    const requiredDirs = [
        'black-hat/src/scenes/cap1',
        'black-hat/src/scenes/cap2', 
        'black-hat/src/scenes/cap3',
        'black-hat/src/scenes/cap4',
        'black-hat/src/scenes/cutscenes',
        'black-hat/src/screens'
    ];
    
    const missingDirs = requiredDirs.filter(dir => !fileExists(dir));
    printResult('Estrutura de pastas', missingDirs.length === 0,
        `${requiredDirs.length - missingDirs.length}/${requiredDirs.length} pastas encontradas`);
    
    if (missingDirs.length > 0) {
        print(`   Pastas ausentes: ${missingDirs.join(', ')}`);
    }
    
    const endTime = Date.now();
    const totalTime = ((endTime - startTime) / 1000).toFixed(2);
    
    printHeader('RESUMO DO TESTE DE INTEGRAÇÃO');
    
    print(`\nEstatísticas:`);
    print(`   Total de imports analisados: ${totalImports}`);
    print(`   Imports válidos: ${validImports}`);
    print(`   Imports inválidos: ${invalidImports}`);
    print(`   Transições de cena: ${transitionResults.total}`);
    print(`   Transições válidas: ${transitionResults.valid}`);
    print(`   Transições inválidas: ${transitionResults.invalid.length}`);
    print(`   Tempo de execução: ${totalTime}s`);
    
    const importSuccessRate = totalImports > 0 ? ((validImports / totalImports) * 100).toFixed(1) : 0;
    const transitionSuccessRate = transitionResults.total > 0 ? ((transitionResults.valid / transitionResults.total) * 100).toFixed(1) : 0;
    
    print(`   Taxa de sucesso (imports): ${importSuccessRate}%`);
    print(`   Taxa de sucesso (transições): ${transitionSuccessRate}%`);
    
    const overallSuccess = invalidImports === 0 && transitionResults.invalid.length === 0 && missingDirs.length === 0;
    
    console.log('\n' + '='.repeat(80));
    if (overallSuccess) {
        print('TODOS OS TESTES DE INTEGRAÇÃO PASSARAM!');
    } else {
        print('ALGUNS TESTES DE INTEGRAÇÃO FALHARAM!');
    }
    console.log('='.repeat(80) + '\n');
    
    return overallSuccess;
}

if (require.main === module) {
    runIntegrationTest();
}

module.exports = { runIntegrationTest }; 