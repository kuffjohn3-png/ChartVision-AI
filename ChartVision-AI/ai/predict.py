from flask import Flask, request, jsonify
from transformers import LlavaNextProcessor, LlavaNextForConditionalGeneration
import torch
from PIL import Image
import io
import re
import json

app = Flask(__name__)

# Your fine-tuned model (replace with your HF username)
MODEL_ID = "Notable-Leks/llama-chart-vision-ft-11b-4bit"

processor = LlavaNextProcessor.from_pretrained(MODEL_ID)
model = LlavaNextForConditionalGeneration.from_pretrained(
    MODEL_ID,
    torch_dtype=torch.float16,
    device_map="auto",
    load_in_4bit=True
)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        file = request.files['chart']
        img = Image.open(io.BytesIO(file.read())).convert('RGB')

        prompt = """You are ChartVision AI – the world's best chart pattern detector.
Analyze this trading chart and output ONLY valid JSON:
{
  "symbol": "BINANCE:BTCUSDT",
  "patterns": [
    {
      "name": "Head & Shoulders",
      "confidence": 0.99,
      "type": "bearish reversal",
      "suggestion": "Strong sell on neckline break"
    }
  ]
}"""

        inputs = processor(images=img, text=prompt, return_tensors="pt").to("cuda")
        with torch.no_grad():
            output = model.generate(**inputs, max_new_tokens=150, temperature=0.1, do_sample=False)

        result = processor.decode(output[0], skip_special_tokens=True)

        # Extract JSON
        json_match = re.search(r'\{.*\}', result, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group())
            return jsonify(data)

        return jsonify({"symbol": "UNKNOWN", "patterns": []})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
