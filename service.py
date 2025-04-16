import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from zhipuai import ZhipuAI
import os
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
logger.info("Loading environment variables...")
load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5500", "http://127.0.0.1:5500"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Get API key from environment variables
ZHIPU_API_KEY = os.getenv('ZHIPU_API_KEY')
logger.info("API Key status: %s", "Found" if ZHIPU_API_KEY else "Missing")
if not ZHIPU_API_KEY:
    raise ValueError("ZHIPU_API_KEY not configured in .env file")

# Initialize ZhipuAI client
try:
    client = ZhipuAI(api_key=ZHIPU_API_KEY)
    logger.info("ZhipuAI client initialized successfully")
except Exception as e:
    logger.error("Failed to initialize ZhipuAI client: %s", str(e))
    raise

@app.route('/chat', methods=['POST'])
def chat_proxy():
    try:
        logger.info("Received chat request")
        data = request.get_json()
        logger.debug("Request data: %s", data)
        
        if not data or 'messages' not in data:
            logger.error("Invalid request format: %s", data)
            return jsonify({"error": "Invalid request format"}), 400
        
        logger.info("Making request to ZhipuAI API...")
        response = client.chat.completions.create(
            model="glm-4-airx",  # Using the latest model
            messages=data['messages'],
            temperature=0.7
        )
        logger.info("Received response from ZhipuAI API")
        logger.debug("Raw API response: %s", response)
        
        # Extract the response message
        try:
            # Convert CompletionMessage to dictionary
            message = {
                "role": response.choices[0].message.role,
                "content": response.choices[0].message.content
            }
            response_data = {
                "choices": [{
                    "message": message,
                    "finish_reason": response.choices[0].finish_reason
                }],
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                }
            }
            logger.info("Successfully processed API response")
            return jsonify(response_data)
        except (AttributeError, IndexError) as e:
            logger.error("Failed to process API response: %s", str(e))
            return jsonify({"error": "Failed to process API response"}), 500
            
    except Exception as e:
        logger.error("Proxy Error: %s", str(e), exc_info=True)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting Flask server on port 5000...")
    app.run(port=5000)