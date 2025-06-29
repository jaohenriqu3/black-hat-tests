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
        print(`\nExecutando teste simples: ${testName}`);
        
        const result = execSync(`node ${testPath}`, { 
            encoding: 'utf8',
            stdio: 'pipe'
        });
        
        const success = result.includes('✅') || 
                       result.includes('PASSOU') || 
                       result.includes('SUCCESS') ||
                       !result.includes('❌') && !result.includes('FALHOU') && !result.includes('FAILED');
        
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

function runJestTest(testPath, testName) {
    try {
        print(`\nExecutando teste Jest: ${testName}`);
        
        const result = execSync(`npx jest ${testPath} --verbose`, { 
            encoding: 'utf8',
            stdio: 'pipe'
        });
        
        const success = result.includes('PASS') && !result.includes('FAIL');
        
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

function runAllTests() {
    printHeader('EXECUTANDO TODOS OS TESTES AUTOMATIZADOS');
    
    const startTime = Date.now();
    const results = {
        total: 0,
        passed: 0,
        failed: 0,
        details: {}
    };
    
    const tests = [
        {
            name: 'DataCenterPC - openPuzzle() (Simples)',
            path: 'tests/dataCenterPC/dataCenterPC.simple.test.js',
            type: 'simple'
        },
        {
            name: 'DataCenterPC - openPuzzle() (Jest)',
            path: 'tests/dataCenterPC/dataCenterPC.test.js',
            type: 'jest'
        },
        {
            name: 'DanteCell - openPuzzle() e closePuzzle() (Simples)',
            path: 'tests/danteCell/danteCell.simple.test.js',
            type: 'simple'
        },
        {
            name: 'DanteCell - openPuzzle() e closePuzzle() (Jest)',
            path: 'tests/danteCell/danteCell.test.js',
            type: 'jest'
        },
        {
            name: 'BlackLock - openPuzzle() e applyOperation() (Simples)',
            path: 'tests/blackLock/blackLock.simple.test.js',
            type: 'simple'
        },
        {
            name: 'BlackLock - openPuzzle() e applyOperation() (Jest)',
            path: 'tests/blackLock/blackLock.test.js',
            type: 'jest'
        }
    ];
    
    print(`\nExecutando ${tests.length} testes...`);
    
    tests.forEach((test, index) => {
        results.total++;
        
        print(`\n[${index + 1}/${tests.length}] ${test.name}`);
        
        if (!fs.existsSync(test.path)) {
            printResult(test.name, false, new Error(`Arquivo não encontrado: ${test.path}`));
            results.failed++;
            results.details[test.name] = { success: false, error: 'Arquivo não encontrado' };
            return;
        }

        let result;
        if (test.type === 'simple') {
            result = runSimpleTest(test.path, test.name);
        } else {
            result = runJestTest(test.path, test.name);
        }
        
        if (result.success) {
            results.passed++;
        } else {
            results.failed++;
        }
        
        results.details[test.name] = result;
    });
    
    const endTime = Date.now();
    const totalTime = ((endTime - startTime) / 1000).toFixed(2);
    
    printHeader('RESUMO DOS TESTES');
    
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
    
    console.log('\n' + '='.repeat(60));
    if (results.failed === 0) {
        print('TODOS OS TESTES PASSARAM!');
    } else {
        print('ALGUNS TESTES FALHARAM!');
    }
    console.log('='.repeat(60) + '\n');
    
    process.exit(results.failed === 0 ? 0 : 1);
}
   
if (require.main === module) {
    runAllTests();
}

module.exports = { runAllTests }; 