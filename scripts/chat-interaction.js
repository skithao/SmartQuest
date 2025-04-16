async function sendQuestion() {
    const question = document.getElementById('questionInput').value;
    const chatWindow = document.getElementById('chatWindow');
    
    if (!question.trim()) {
        return;
    }

    chatWindow.innerHTML += `<div class="chat-message user-message">你：${question}</div>`;
    chatWindow.innerHTML += `<div class="loading-dots chat-message bot-message">机器人：正在思考<span>.</span><span>.</span><span>.</span></div>`;
    
    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "user",
                        content: question
                    }
                ]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        if (data?.choices?.[0]?.message?.content) {
            const botResponse = data.choices[0].message.content;
            const lastLoading = chatWindow.querySelector('.loading-dots');
            if (lastLoading) {
                lastLoading.outerHTML = `<div class="chat-message bot-message">机器人：${botResponse}</div>`;
            }
        } else {
            throw new Error('Invalid API response format');
        }
    } catch (error) {
        console.error('Chat Error:', error);
        const lastLoading = chatWindow.querySelector('.loading-dots');
        if (lastLoading) {
            lastLoading.outerHTML = `<div class="chat-message error-message">机器人：抱歉，我遇到了问题（${error.message}）</div>`;
        }
    }

    // 清空输入框
    document.getElementById('questionInput').value = '';
    
    // 滚动到底部
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 添加按回车发送功能
document.getElementById('questionInput')?.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendQuestion();
    }
});

window.sendQuestion = sendQuestion;