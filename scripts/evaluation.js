const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

// 配置常量
const CONFIG = {
    REPORT_PATH: path.join(__dirname, '../evaluation-report.md'),
    API_ENDPOINT: 'http://localhost:5000/chat',
    TEST_DATA_PATH: path.join(__dirname, '../test-data.json'),
    DEFAULT_TEST_DATA: {
        customerService: [
            { input: "测试问题1", expected: ["测试", "回答"] }
        ],
        sentimentAnalysis: [
            { text: "测试文本", expectedScore: 0.5 }
        ]
    }
};

// 测试结果统计 - 修改为自动初始化所有模块
const testResults = {
    customerService: { count: 0, correct: 0, times: [] },
    academicWriting: { count: 0, correct: 0, times: [] },
    creativeWriting: { count: 0, correct: 0, times: [] },
    languageLearning: { count: 0, correct: 0, times: [] },
    dataAnalysis: { count: 0, correct: 0, times: [] },
    presentationSkills: { count: 0, correct: 0, times: [] },
    researchMethods: { count: 0, correct: 0, times: [] },
    crossDisciplinary: { count: 0, correct: 0, times: [] },
    ethicalUse: { count: 0, correct: 0, times: [] },
    groupCollaboration: { count: 0, correct: 0, times: [] },
    subjectTemplates: { count: 0, correct: 0, times: [] },
    multimodalGeneration: { count: 0, correct: 0, times: [] },
    accessibility: { count: 0, correct: 0, times: [] },
    evaluation: { count: 0, correct: 0, times: [] },
    totalTests: 0,
    errors: 0
};

// 加载测试数据
function loadTestData() {
    try {
        const rawData = JSON.parse(fs.readFileSync(CONFIG.TEST_DATA_PATH, 'utf-8'));
        return {
            customerService: rawData.basicUsage || [],
            academicWriting: rawData.academicWriting || [],
            creativeWriting: rawData.creativeWriting || [],
            languageLearning: rawData.languageLearning || [],
            dataAnalysis: rawData.dataAnalysis || [],
            presentationSkills: rawData.presentationSkills || [],
            researchMethods: rawData.researchMethods || [],
            crossDisciplinary: rawData.crossDisciplinary || [],
            ethicalUse: rawData.ethicalUse || [],
            groupCollaboration: rawData.groupCollaboration || [],
            subjectTemplates: rawData.subjectTemplates || [],
            multimodalGeneration: rawData.multimodalGeneration || [],
            accessibility: rawData.accessibility || [],
            evaluation: rawData.evaluation || []
        };
    } catch (error) {
        console.warn('加载测试数据失败，使用默认数据');
        return {
            customerService: [
                { input: "测试问题1", expected: ["测试", "回答"] }
            ]
        };
    }
}

// 测试通用模块
// 修改testModule函数中的错误处理
async function testModule(moduleName, promptTemplate = "{input}") {
    const testCases = loadTestData()[moduleName];
    if (!testCases || testCases.length === 0) {
        console.warn(`没有找到${moduleName}的测试数据`);
        return;
    }

    if (!testResults[moduleName]) {
        testResults[moduleName] = { count: 0, correct: 0, times: [] };
    }

    for (const testCase of testCases) {
        const start = performance.now();
        try {
            const data = await callAPI([{
                role: "user",
                content: promptTemplate.replace("{input}", testCase.input)
            }]);
            const content = data.choices[0].message.content.toLowerCase();
            
            // 改进验证逻辑：匹配更多关键词即视为正确
            const matchedKeywords = testCase.expected.filter(keyword => 
                content.includes(keyword.toLowerCase())
            );
            // 如果匹配到超过一半的关键词或至少3个，视为正确
            const isValid = matchedKeywords.length >= Math.max(3, testCase.expected.length / 2);
            
            testResults[moduleName].correct += isValid ? 1 : 0;
            testResults[moduleName].times.push(performance.now() - start);
            
            // 记录匹配的关键词用于调试
            console.log(`[${moduleName}] 匹配关键词: ${matchedKeywords.join(', ')}`);
        } catch (error) {
            testResults.errors++;
            console.error(`${moduleName}测试失败: ${error.message}`);
        }
        testResults[moduleName].count++;
        testResults.totalTests++;
    }
}

// 改进报告生成函数
function generateSummary() {
    let totalTime = [];
    Object.keys(testResults).forEach(module => {
        if (testResults[module].times) {
            totalTime = totalTime.concat(testResults[module].times);
        }
    });
    
    const avgTime = totalTime.reduce((a, b) => a + b, 0) / totalTime.length || 0;
    const totalAccuracy = Object.keys(testResults)
        .filter(m => testResults[m].count > 0)
        .reduce((sum, m) => sum + (testResults[m].correct / testResults[m].count), 0) / 
        Object.keys(testResults).filter(m => testResults[m].count > 0).length * 100;
    
    const summary = `\n## 测试总结\n` +
        `- 总测试用例: ${testResults.totalTests}\n` +
        `- 平均准确率: ${totalAccuracy.toFixed(2)}%\n` +
        `- 错误率: ${((testResults.errors / testResults.totalTests) * 100).toFixed(2)}%\n` +
        `- 平均响应时间: ${avgTime.toFixed(2)}ms\n\n` +
        `评测完成，报告已保存至: ${CONFIG.REPORT_PATH}`;
    
    fs.appendFileSync(CONFIG.REPORT_PATH, summary);
    console.log(summary);
}

// 初始化报告
function initReport() {
    const header = `# SmartQuest 评测报告\n\n` +
        `生成时间: ${new Date().toLocaleString()}\n\n` +
        `## 测试概况\n` +
        `| 测试模块 | 测试用例数 | 平均响应时间(ms) | 准确率 |\n` +
        `|----------|------------|------------------|--------|\n`;
    fs.writeFileSync(CONFIG.REPORT_PATH, header);
}

// 添加测试结果到报告
function addResult(moduleName) {
    const stats = testResults[moduleName];
    const avgTime = stats.times.reduce((a, b) => a + b, 0) / stats.times.length || 0;
    const accuracy = stats.count > 0 ? (stats.correct / stats.count) : 0;
    
    const row = `| ${moduleName} | ${stats.count} | ${avgTime.toFixed(2)} | ${(accuracy * 100).toFixed(2)}% |\n`;
    fs.appendFileSync(CONFIG.REPORT_PATH, row);
}

// 调用API
async function callAPI(messages) {
    const response = await fetch(CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
    });
    return response.json();
}

// 生成总结报告
function generateSummary() {
    const totalTime = [...testResults.customerService.times, ...testResults.sentimentAnalysis.times];
    const avgTime = totalTime.reduce((a, b) => a + b, 0) / totalTime.length || 0;
    
    const summary = `\n## 测试总结\n` +
        `- 总测试用例: ${testResults.totalTests}\n` +
        `- 错误率: ${((testResults.errors / testResults.totalTests) * 100).toFixed(2)}%\n` +
        `- 平均响应时间: ${avgTime.toFixed(2)}ms\n\n` +
        `评测完成，报告已保存至: ${CONFIG.REPORT_PATH}`;
    
    fs.appendFileSync(CONFIG.REPORT_PATH, summary);
    console.log(summary);
}

// 主函数 - 移除sentimentAnalysis测试调用
async function main() {
    initReport();
    console.log('开始评测 SmartQuest 系统...');
    
    // 测试所有模块
    await testModule('customerService');
    await testModule('academicWriting');
    await testModule('creativeWriting');
    await testModule('languageLearning');
    await testModule('dataAnalysis');
    await testModule('presentationSkills');
    await testModule('researchMethods');
    await testModule('crossDisciplinary');
    await testModule('ethicalUse');
    await testModule('groupCollaboration');
    await testModule('subjectTemplates');
    await testModule('multimodalGeneration');
    await testModule('accessibility');
    await testModule('evaluation');
    
    // 添加所有测试结果到报告
    Object.keys(testResults).forEach(module => {
        if (typeof testResults[module] === 'object' && module !== 'totalTests' && module !== 'errors') {
            addResult(module);
        }
    });
    
    generateSummary();
}

main().catch(console.error);