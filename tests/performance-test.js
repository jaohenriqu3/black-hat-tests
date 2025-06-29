const fs = require('fs');
const path = require('path');

function print(message) {
    console.log(message);
}

function printHeader(title) {
    console.log('\n' + '='.repeat(100));
    print(`PERFORMANCE: ${title}`);
    console.log('='.repeat(100));
}

function printResult(testName, success, details = '') {
    const status = success ? 'PASSOU' : 'FALHOU';
    print(`\n${status}: ${testName}`);
    if (details) {
        print(`   Detalhes: ${details}`);
    }
}

function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.size;
    } catch (error) {
        return 0;
    }
}

function getDirectorySize(dirPath) {
    let totalSize = 0;
    try {
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                totalSize += getDirectorySize(filePath);
            } else {
                totalSize += stats.size;
            }
        });
    } catch (error) {
        return 0;
    }
    return totalSize;
}

function getAllJsFilesRecursively(dirPath) {
    let jsFiles = [];
    if (!fs.existsSync(dirPath)) return jsFiles;
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            jsFiles = jsFiles.concat(getAllJsFilesRecursively(filePath));
        } else if (file.endsWith('.js')) {
            jsFiles.push(filePath);
        }
    });
    return jsFiles;
}

function analyzeAssets() {
    const assetsDir = 'black-hat/assets';
    const results = {
        totalSize: 0,
        categories: {},
        files: {
            images: [],
            audios: [],
            sprites: [],
            tilesets: [],
            tilemaps: [],
            fonts: [],
            screens: []
        }
    };

    const categories = [
        'images', 'audios', 'sprites', 'tilesets', 
        'tilemaps', 'fonts', 'screens', 'inputs', 'coreBar', 'preload'
    ];

    categories.forEach(category => {
        const categoryPath = path.join(assetsDir, category);
        if (fs.existsSync(categoryPath)) {
            const size = getDirectorySize(categoryPath);
            results.categories[category] = {
                size: size,
                sizeMB: (size / (1024 * 1024)).toFixed(2)
            };
            results.totalSize += size;
        }
    });

    return results;
}

function analyzeScenes() {
    const scenesDir = 'black-hat/src/scenes';
    const results = {
        total: 0,
        categories: {},
        files: []
    };

    const categories = ['cap1', 'cap2', 'cap3', 'cap4', 'globals'];
    
    categories.forEach(category => {
        const categoryPath = path.join(scenesDir, category);
        if (fs.existsSync(categoryPath)) {
            const jsFiles = getAllJsFilesRecursively(categoryPath);
            results.categories[category] = {
                count: jsFiles.length,
                files: jsFiles.map(f => path.relative(scenesDir, f))
            };
            results.total += jsFiles.length;
            results.files.push(...jsFiles.map(f => path.relative(scenesDir, f)));
        }
    });

    return results;
}

function analyzeCutscenes() {
    const cutscenesDir = 'black-hat/src/scenes/cutscenes';
    const jsFiles = getAllJsFilesRecursively(cutscenesDir);
    return {
        total: jsFiles.length,
        files: jsFiles.map(f => path.relative('black-hat/src/scenes', f))
    };
}

function analyzePrefabs() {
    const prefabsDir = 'black-hat/src/prefabs';
    const jsFiles = getAllJsFilesRecursively(prefabsDir);
    return {
        total: jsFiles.length,
        files: jsFiles.map(f => path.relative('black-hat/src/prefabs', f))
    };
}

function analyzeNPCs() {
    const npcsDir = 'black-hat/src/prefabs/NPCs';
    const jsFiles = getAllJsFilesRecursively(npcsDir);
    return {
        total: jsFiles.length,
        files: jsFiles.map(f => path.relative('black-hat/src/prefabs/NPCs', f))
    };
}

function analyzeComponents() {
    const componentsDir = 'black-hat/src/components';
    const results = {
        total: 0,
        components: {},
        files: []
    };

    if (fs.existsSync(componentsDir)) {
        const components = fs.readdirSync(componentsDir);
        components.forEach(component => {
            const componentPath = path.join(componentsDir, component);
            if (fs.statSync(componentPath).isDirectory()) {
                const jsFiles = getAllJsFilesRecursively(componentPath);
                results.components[component] = {
                    count: jsFiles.length,
                    files: jsFiles.map(f => path.relative(componentsDir, f))
                };
                results.total += jsFiles.length;
                results.files.push(...jsFiles.map(f => path.relative(componentsDir, f)));
            }
        });
    }

    return results;
}

function analyzeScreens() {
    const screensDir = 'black-hat/src/screens';
    const results = {
        total: 0,
        files: []
    };

    if (fs.existsSync(screensDir)) {
        const jsFiles = getAllJsFilesRecursively(screensDir);
        results.total = jsFiles.length;
        results.files = jsFiles.map(f => path.relative(screensDir, f));
    }

    return results;
}

function estimateLoadingTime(assetsSize, sceneCount, componentCount) {
    const baseLoadingTime = 2.0;
    const sizeFactor = assetsSize / (1024 * 1024 * 100);
    const complexityFactor = (sceneCount + componentCount) / 50;
    
    const estimatedTime = baseLoadingTime + sizeFactor + complexityFactor;
    return Math.max(estimatedTime, 1.0);
}

function analyzePerformance() {
    printHeader('TESTE DE PERFORMANCE - ANÁLISE COMPLETA DO JOGO');
    
    const startTime = Date.now();
    
    print('\n1. ANALISANDO ASSETS E RECURSOS');
    const assetsResults = analyzeAssets();
    
    printResult('Análise de assets', true, 
        `Total: ${(assetsResults.totalSize / (1024 * 1024)).toFixed(2)} MB`);
    
    Object.keys(assetsResults.categories).forEach(category => {
        const data = assetsResults.categories[category];
        print(`   ${category}: ${data.sizeMB} MB`);
    });
    
    print('\n2. ANALISANDO CENAS E ESTRUTURA');
    const scenesResults = analyzeScenes();
    
    printResult('Análise de cenas', true, 
        `Total: ${scenesResults.total} cenas`);
    
    Object.keys(scenesResults.categories).forEach(category => {
        const data = scenesResults.categories[category];
        print(`   ${category}: ${data.count} cenas`);
    });
    
    print('\n3. ANALISANDO CUTSCENES');
    const cutscenesResults = analyzeCutscenes();
    printResult('Análise de cutscenes', true, 
        `Total: ${cutscenesResults.total} cutscenes`);
    
    print('\n4. ANALISANDO COMPONENTES');
    const componentsResults = analyzeComponents();
    
    printResult('Análise de componentes', true, 
        `Total: ${componentsResults.total} componentes`);
    
    Object.keys(componentsResults.components).forEach(component => {
        const data = componentsResults.components[component];
        print(`   ${component}: ${data.count} arquivos`);
    });
    
    print('\n5. ANALISANDO PREFABS');
    const prefabsResults = analyzePrefabs();
    printResult('Análise de prefabs', true, 
        `Total: ${prefabsResults.total} prefabs`);
    
    print('\n6. ANALISANDO NPCs');
    const npcsResults = analyzeNPCs();
    printResult('Análise de NPCs', true, 
        `Total: ${npcsResults.total} NPCs`);
    
    print('\n7. ANALISANDO SCREENS');
    const screensResults = analyzeScreens();
    
    printResult('Análise de screens', true, 
        `Total: ${screensResults.total} screens`);
    
    print('\n8. ESTIMATIVA DE PERFORMANCE');
    
    const totalAssetsSize = assetsResults.totalSize;
    const totalScenes = scenesResults.total;
    const totalComponents = componentsResults.total;
    const totalPrefabs = prefabsResults.total;
    const totalScreens = screensResults.total;
    
    const estimatedLoadingTime = estimateLoadingTime(totalAssetsSize, totalScenes, totalComponents);
    
    printResult('Estimativa de carregamento', true, 
        `${estimatedLoadingTime.toFixed(1)} segundos`);
    
    const performanceScore = calculatePerformanceScore(totalAssetsSize, totalScenes, totalComponents);
    
    printResult('Score de performance', true, 
        `${performanceScore}/100 pontos`);
    
    const endTime = Date.now();
    const totalTime = ((endTime - startTime) / 1000).toFixed(2);
    
    printHeader('RESUMO DA ANÁLISE DE PERFORMANCE');
    
    print(`\nEstatísticas Gerais:`);
    print(`   Tamanho total dos assets: ${(totalAssetsSize / (1024 * 1024)).toFixed(2)} MB`);
    print(`   Total de cenas: ${totalScenes}`);
    print(`   Total de cutscenes: ${cutscenesResults.total}`);
    print(`   Total de componentes: ${totalComponents}`);
    print(`   Total de prefabs: ${totalPrefabs}`);
    print(`   Total de NPCs: ${npcsResults.total}`);
    print(`   Total de screens: ${totalScreens}`);
    print(`   Tempo estimado de carregamento: ${estimatedLoadingTime.toFixed(1)}s`);
    print(`   Score de performance: ${performanceScore}/100`);
    print(`   Tempo de análise: ${totalTime}s`);
      
    return {
        assetsSize: totalAssetsSize,
        scenes: totalScenes,
        cutscenes: cutscenesResults.total,
        components: totalComponents,
        prefabs: totalPrefabs,
        npcs: npcsResults.total,
        screens: totalScreens,
        loadingTime: estimatedLoadingTime,
        performanceScore: performanceScore,
    };
}

function calculatePerformanceScore(assetsSize, sceneCount, componentCount) {
    const sizeScore = Math.max(0, 100 - (assetsSize / (1024 * 1024 * 10)));
    const complexityScore = Math.max(0, 100 - ((sceneCount + componentCount) / 2));
    
    return Math.round((sizeScore + complexityScore) / 2);
}

if (require.main === module) {
    analyzePerformance();
}

module.exports = { analyzePerformance }; 