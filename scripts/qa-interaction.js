async function sendQaQuestion() {
    const question = document.getElementById('qaQuestionInput').value;
    const qaChatWindow = document.getElementById('qaChatWindow');
    
    if (!question.trim()) return;

    // 获取当前时间
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 添加用户消息
    qaChatWindow.innerHTML += `
        <div class="chat-message user-message">
            <p>${question}</p>
            <span class="message-time">${timeString}</span>
        </div>
        <div class="chat-message bot-message loading-dots">
            <p>正在思考...</p>
        </div>
    `;
    
    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [{
                    role: "user",
                    content: question
                }]
            })
        });
        
        const data = await response.json();
        const botResponse = data.choices[0].message.content;
        
        // 替换加载中的消息
        const loadingMessages = qaChatWindow.querySelectorAll('.loading-dots');
        if (loadingMessages.length > 0) {
            loadingMessages[loadingMessages.length - 1].outerHTML = `
                <div class="chat-message bot-message">
                    <p>${botResponse}</p>
                    <span class="message-time">${timeString}</span>
                </div>
            `;
        }
    } catch (error) {
        console.error('QA Error:', error);
        const loadingMessages = qaChatWindow.querySelectorAll('.loading-dots');
        if (loadingMessages.length > 0) {
            loadingMessages[loadingMessages.length - 1].outerHTML = `
                <div class="chat-message bot-message">
                    <p>回答问题时出错，请稍后重试</p>
                    <span class="message-time">${timeString}</span>
                </div>
            `;
        }
    }
    
    // 清空输入框并滚动到底部
    document.getElementById('qaQuestionInput').value = '';
    qaChatWindow.scrollTop = qaChatWindow.scrollHeight;
}

window.sendQaQuestion = sendQaQuestion;