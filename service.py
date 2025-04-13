from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from dotenv import load_dotenv
load_dotenv()  # 加载环境变量

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": os.getenv('CORS_ORIGINS', '*')}})

# 从环境变量获取API密钥
ZHIPU_API_KEY = os.getenv('ZHIPU_API_KEY')
if not ZHIPU_API_KEY:
    raise ValueError("未配置ZHIPU_API_KEY，请在.env文件中配置")

API_KEY = "1be3a7964e95470e9a3aa181e2472403.klHkoXaE2ZRaMNpZ".strip()  # 添加去除空格处理

@app.route('/chat', methods=['POST'])
def chat_proxy():
    try:
        data = request.get_json()
        if not data or 'messages' not in data:
            return jsonify({"error": "Invalid request format"}), 400
            
        response = requests.post(
            "https://open.bigmodel.cn/api/paas/v3/model-api/chat/completions",
            headers={
                "Authorization": f"Bearer {API_KEY}",  # 确保使用处理后的密钥
                "Content-Type": "application/json"
            },
            json={
                "model": "chatglm_pro",
                "messages": data['messages'],
                "temperature": 0.7
            }
        )
        # 添加详细错误日志
        print("API Response:", response.status_code, response.text)
        return jsonify(response.json())
    except Exception as e:
        print("Proxy Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)