from flask import Flask, request, jsonify
from flask_cors import CORS
from currency_conversion import convert_currency

app = Flask(__name__)
CORS(app)

@app.route('/convert', methods=['GET'])
def convert():
    currency = request.args.get('currency')
    result = convert_currency(150, currency)
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
