async function generateCode() {
    const prompt = document.querySelector('#codeOutput').previousElementSibling.value;
    
    try {
        const response = await fetch(ZHIPU_API_URL, {
            // 添加代码生成专用参数...
        });
        progressState.addModule('code-generation');
    } catch (error) {
        console.error('代码生成失败:', error);
    }
}