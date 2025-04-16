async function analyzeSentiment() {
    const input = document.getElementById('sentimentInput').value;
    const outputElement = document.getElementById('sentimentResult');
    outputElement.innerHTML = '正在分析情感...';
    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [{
                    role: "user",
                    content: `请分析以下文本的情感倾向：${input}`
                }]
            })
        });
        const data = await response.json();
        outputElement.innerHTML = data.choices[0].message.content;
    } catch (error) {
        console.error('Sentiment Analysis Error:', error);
        outputElement.innerHTML = '分析情感时出错，请稍后重试。';
    }
}

window.analyzeSentiment = analyzeSentiment;