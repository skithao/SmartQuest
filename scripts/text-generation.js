async function generateText() {
    const input = document.getElementById('textInput').value;
    const outputElement = document.getElementById('generatedText');
    outputElement.innerHTML = '正在生成文本...';
    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [{
                    role: "user",
                    content: `生成与以下相关的文本：${input}`
                }]
            })
        });
        const data = await response.json();
        outputElement.innerHTML = data.choices[0].message.content;
    } catch (error) {
        console.error('Text Generation Error:', error);
        outputElement.innerHTML = '生成文本时出错，请稍后重试。';
    }
}

window.generateText = generateText;