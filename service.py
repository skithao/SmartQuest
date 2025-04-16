from flask import Flask, jsonify, request
from flask_cors import CORS
from zhipuai import ZhipuAI
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": os.getenv('CORS_ORIGINS', '*')}})

# Get API key from environment variables
ZHIPU_API_KEY = os.getenv('ZHIPU_API_KEY')
if not ZHIPU_API_KEY:
    raise ValueError("ZHIPU_API_KEY not configured in .env file")

# Initialize ZhipuAI client
client = ZhipuAI(api_key=ZHIPU_API_KEY)

@app.route('/chat', methods=['POST'])
def chat_proxy():
    try:
        data = request.get_json()
        if not data or 'messages' not in data:
            return jsonify({"error": "Invalid request format"}), 400
            
        response = client.chat.completions.create(
            model="glm-4-airx",  # Using the latest model
            messages=data['messages'],
            temperature=0.7
        )
        
        # Extract the response message
        response_data = {
            "choices": [{
                "message": response.choices[0].message,
                "finish_reason": response.choices[0].finish_reason
            }],
            "usage": response.usage
        }
        
        return jsonify(response_data)
    except Exception as e:
        print("Proxy Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)