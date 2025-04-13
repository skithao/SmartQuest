async function sendQaQuestion() {
    const question = document.getElementById('qaQuestionInput').value;
    const qaChatWindow = document.getElementById('qaChatWindow');
    qaChatWindow.innerHTML += `<p>你：${question}</p>`;
    qaChatWindow.innerHTML += `<p>机器人：正在思考...请稍后</p>`;
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
                        "content": question
                    }
                ]
            })
        });
        const data = await response.json();
        const lastIndex = qaChatWindow.innerHTML.lastIndexOf('<p>机器人：正在思考...请稍后</p>');
        qaChatWindow.innerHTML = qaChatWindow.innerHTML.slice(0, lastIndex) + `<p>机器人：${data.data.choices[0].message.content}</p>`;
    } catch (error) {
        const lastIndex = qaChatWindow.innerHTML.lastIndexOf('<p>机器人：正在思考...请稍后</p>');
        qaChatWindow.innerHTML = qaChatWindow.innerHTML.slice(0, lastIndex) + `<p>机器人：回答问题时出错，请稍后重试。</p>`;
        console.error(error);
    }
    document.getElementById('qaQuestionInput').value = '';
}

window.sendQaQuestion = sendQaQuestion;