async function generateSummary() {
    const input = document.getElementById('summaryInput').value;
    const outputElement = document.getElementById('summaryResult');
    outputElement.innerHTML = '正在生成摘要...';
    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [{
                    role: "user",
                    content: `请对以下文本进行摘要：${input}`
                }]
            })
        });
        const data = await response.json();
        outputElement.innerHTML = data.choices[0].message.content;
    } catch (error) {
        console.error('Summary Error:', error);
        let errorMsg = '生成摘要时出错，请稍后重试。';
        if (error.message.includes('Failed to fetch')) {
            errorMsg = '无法连接到摘要服务，请检查后端是否运行';
        }
        outputElement.innerHTML = errorMsg;
    }
}

window.generateSummary = generateSummary;