const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function print(message) {
    console.log(message);
}

function printHeader(title) {
    console.log('\n' + '='.repeat(60));
    print(`TESTE: ${title}`);
    console.log('='.repeat(60));
}

function printResult(testName, success, error = null) {
    const status = success ? 'PASSOU' : 'FALHOU';
    
    print(`\n${status}: ${testName}`);
    
    if (!success && error) {
        print(`Erro: ${error.message}`);
    }
}

function runSimpleTest(testPath, testName) {
    try {
        print(`\nExecutando teste: ${testName}`);
        
        const result = execSync(`node ${testPath}`, { 
            encoding: 'utf8',
            stdio: 'pipe'
        });
        
        const success = result.includes('✅') || 
                       result.includes('PASSOU') || 
                       result.includes('SUCCESS') ||
                       result.includes('Testes aprovados') ||
                       (!result.includes('❌') && !result.includes('FALHOU') && !result.includes('FAILED'));
        
        printResult(testName, success);
        
        if (success) {
            print('Detalhes do teste:');
            console.log(result);
        }
        
        return { success, output: result };
        
    } catch (error) {
        printResult(testName, false, error);
        return { success: false, output: error.message };
    }
}

function runAllSimpleTests() {
    printHeader('EXECUTANDO TODOS OS TESTES SIMPLES AUTOMATIZADOS');
    
    const startTime = Date.now();
    const results = {
        total: 0,
        passed: 0,
        failed: 0,
        details: {}
    };
    
    const tests = [
        {
            name: 'DataCenterPC - openPuzzle()',
            path: 'tests/dataCenterPC/dataCenterPC.simple.test.js',
            description: 'Testa criação do popup, grid 3x3, botões e limpeza de recursos'
        },
        {
            name: 'DanteCell - openPuzzle() e closePuzzle()',
            path: 'tests/danteCell/danteCell.simple.test.js',
            description: 'Testa criação do container, textos binários, visibilidade e limpeza'
        },
        {
            name: 'BlackLock - openPuzzle() e applyOperation()',
            path: 'tests/blackLock/blackLock.simple.test.js',
            description: 'Testa criação do puzzle, operações lógicas, feedback e transições'
        }
    ];
    
    print(`\nExecutando ${tests.length} testes simples...`);
    
    tests.forEach((test, index) => {
        results.total++;
        
        print(`\n[${index + 1}/${tests.length}] ${test.name}`);
        print(`   Descrição: ${test.description}`);

        if (!fs.existsSync(test.path)) {
            printResult(test.name, false, new Error(`Arquivo não encontrado: ${test.path}`));
            results.failed++;
            results.details[test.name] = { success: false, error: 'Arquivo não encontrado' };
            return;
        }

        const result = runSimpleTest(test.path, test.name);
        
        if (result.success) {
            results.passed++;
        } else {
            results.failed++;
        }
        
        results.details[test.name] = result;
    });
    
    const endTime = Date.now();
    const totalTime = ((endTime - startTime) / 1000).toFixed(2);
    
    printHeader('RESUMO DOS TESTES SIMPLES');
    
    print(`\nEstatísticas:`);
    print(`   Total de testes: ${results.total}`);
    print(`   Passaram: ${results.passed}`);
    print(`   Falharam: ${results.failed}`);
    print(`   Tempo total: ${totalTime}s`);
    
    const successRate = ((results.passed / results.total) * 100).toFixed(1);
    print(`   Taxa de sucesso: ${successRate}%`);
    
    if (results.failed > 0) {
        print(`\nTestes que falharam:`);
        Object.entries(results.details).forEach(([testName, result]) => {
            if (!result.success) {
                print(`   • ${testName}`);
                if (result.error) {
                    print(`     Erro: ${result.error}`);
                }
            }
        });
    }
    
    if (results.passed > 0) {
        print(`\nTestes que passaram:`);
        Object.entries(results.details).forEach(([testName, result]) => {
            if (result.success) {
                print(`   • ${testName}`);
            }
        });
    }
    
    print(`\nFunções testadas:`);
    print(`   • DataCenterPC.openPuzzle()`);
    print(`   • DanteCell.openPuzzle()`);
    print(`   • DanteCell.closePuzzle()`);
    print(`   • BlackLock.openPuzzle()`);
    print(`   • BlackLock.applyOperation()`);
    
    print(`\nFuncionalidades testadas:`);
    print(`   • Criação de popups e interfaces`);
    print(`   • Grid de peças interativas (3x3)`);
    print(`   • Sequências binárias (4 elementos)`);
    print(`   • Operações lógicas (AND, OR, XOR, NOT)`);
    print(`   • Feedback visual e transições`);
    print(`   • Gerenciamento de visibilidade`);
    print(`   • Limpeza de recursos`);
    
    console.log('\n' + '='.repeat(60));
    if (results.failed === 0) {
        print('TESTES APROVADOS!');
    } else {
        print('ALGUNS TESTES FALHARAM!');
    }
    console.log('='.repeat(60) + '\n');
    
    
    process.exit(results.failed === 0 ? 0 : 1);
}

if (require.main === module) {
    runAllSimpleTests();
}

module.exports = { runAllSimpleTests }; 