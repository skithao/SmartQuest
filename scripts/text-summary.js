async function generateSummary() {
    const input = document.getElementById('summaryInput').value;
    const outputElement = document.getElementById('summaryResult');
    outputElement.innerHTML = '正在生成摘要...';
    try {
        const response = await fetch(ZHIPU_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZHIPU_API_KEY}`
            },
            body: JSON.stringify({
                "messages": [
                    {
                        "role": "user",
                        "content": `请对以下文本进行摘要：${input}`
                    }
                ]
            })
        });
        const data = await response.json();
        outputElement.innerHTML = data.data.choices[0].message.content;
    } catch (error) {
        outputElement.innerHTML = '生成摘要时出错，请稍后重试。';
        console.error(error);
    }
}

window.generateSummary = generateSummary;