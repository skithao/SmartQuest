async function generateText() {
    const input = document.getElementById('textInput').value;
    const outputElement = document.getElementById('generatedText');
    outputElement.innerHTML = '正在生成文本...';
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
                        "content": `生成与以下相关的文本：${input}`
                    }
                ]
            })
        });
        const data = await response.json();
        outputElement.innerHTML = data.data.choices[0].message.content;
    } catch (error) {
        outputElement.innerHTML = '生成文本时出错，请稍后重试。';
        console.error(error);
    }
}

window.generateText = generateText;