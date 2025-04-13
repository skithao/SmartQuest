async function sendQuestion() {
    const question = document.getElementById('questionInput').value;
    const chatWindow = document.getElementById('chatWindow');
    
    chatWindow.innerHTML += `<div class="loading-dots">机器人：正在思考<span>.</span><span>.</span><span>.</span></div>`;
    
    try {
        const response = await fetch(ZHIPU_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZHIPU_API_KEY.replace(' ', '')}` // 确保移除空格
            },
            body: JSON.stringify({
                "model": "chatglm_pro",
                "messages": [ // 修正为数组格式
                    {
                        "role": "user",
                        "content": question
                    }
                ],
                "temperature": 0.7
            })
        });

        const data = await response.json();
        if (data?.data?.choices?.[0]?.message?.content) {
            const lastLoading = chatWindow.querySelector('.loading-dots:last-child');
            lastLoading.outerHTML = `<p class="bot-message">机器人：${data.data.choices[0].message.content}</p>`;
        } else {
            throw new Error('Invalid API response');
        }
    } catch (error) {
        const lastLoading = chatWindow.querySelector('.loading-dots:last-child');
        lastLoading.outerHTML = `<p class="error-message">机器人：回答遇到技术问题，请稍后重试（错误码：${error.message.slice(0, 20)}）</p>`;
        console.error('API Error:', error);
    }
    document.getElementById('questionInput').value = '';
}

window.sendQuestion = sendQuestion;