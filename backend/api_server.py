#!/usr/bin/env python3
"""
Walrus Analytics Backend API
Provides endpoints for reading data from Walrus storage
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from flasgger import Swagger
import os
import importlib
from dotenv import load_dotenv

# Import from lambda module using importlib (lambda is a reserved keyword)
walrus_service_module = importlib.import_module('lambda.walrus_service')
WalrusService = walrus_service_module.WalrusService

# Load environment variables from root directory
from pathlib import Path
root_dir = Path(__file__).parent.parent
dotenv_path = root_dir / '.env'
load_dotenv(dotenv_path=dotenv_path)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Initialize Swagger
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec',
            "route": '/apispec.json',
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/apidocs/"
}

swagger_template = {
    "info": {
        "title": "Walrus Analytics API",
        "description": "Backend API for Walrus storage operations",
        "version": "1.0.0",
        "contact": {
            "name": "API Support",
            "email": "support@example.com"
        }
    },
    "schemes": ["http", "https"],
    "tags": [
        {
            "name": "Health",
            "description": "Health check endpoints"
        },
        {
            "name": "Blob Operations",
            "description": "Read and write operations for Walrus blobs"
        }
    ]
}

swagger = Swagger(app, config=swagger_config, template=swagger_template)

# Initialize Walrus service
walrus_service = WalrusService(
    publisher_url=os.getenv("WALRUS_PUBLISHER_URL", "https://publisher.walrus-testnet.walrus.space"),
    aggregator_url=os.getenv("WALRUS_AGGREGATOR_URL", "https://aggregator.walrus-testnet.walrus.space"),
    walrus_cli_path="/Users/noname/.local/bin/walrus"
)

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint
    ---
    tags:
      - Health
    responses:
      200:
        description: API health status
        schema:
          type: object
          properties:
            status:
              type: string
              example: running
            service:
              type: string
              example: Walrus Analytics API
            version:
              type: string
              example: 1.0.0
    """
    return jsonify({
        "status": "running",
        "service": "Walrus Analytics API",
        "version": "1.0.0"
    })

@app.route('/api/blob/<blob_id>', methods=['GET'])
def read_blob(blob_id):
    """Read a blob from Walrus storage
    ---
    tags:
      - Blob Operations
    parameters:
      - name: blob_id
        in: path
        type: string
        required: true
        description: Walrus blob ID
        example: AiAQDmNUwpxj1boxbJiYmKqdlfpqhd2i25L3ZBLh0ug
      - name: format
        in: query
        type: string
        required: false
        default: text
        enum: [json, text, binary]
        description: Format to parse the blob content
    responses:
      200:
        description: Blob content retrieved successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            blob_id:
              type: string
            format:
              type: string
            size_bytes:
              type: integer
            content:
              type: object
              description: The blob content (structure varies by format)
            metadata:
              type: object
      400:
        description: Invalid format or content error
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: false
            error:
              type: string
      500:
        description: Server error
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: false
            error:
              type: string
    """
    try:
        # Get format parameter
        format_type = request.args.get('format', 'text')

        print(f"📥 Reading blob: {blob_id} (format: {format_type})")

        # Use walrus_service to read blob
        result = walrus_service.read_blob(blob_id, format_type)
        return jsonify(result)

    except ValueError as e:
        print(f"⚠️ Validation error: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400
    except Exception as e:
        print(f"❌ Error reading blob: {e}")
        return jsonify({
            "success": False,
            "error": str(e),
            "blob_id": blob_id
        }), 500

@app.route('/api/blob/<blob_id>/csv', methods=['GET'])
def read_blob_as_csv(blob_id):
    """Read and parse blob as CSV
    ---
    tags:
      - Blob Operations
    parameters:
      - name: blob_id
        in: path
        type: string
        required: true
        description: Walrus blob ID containing CSV data
    responses:
      200:
        description: CSV data parsed successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            blob_id:
              type: string
            format:
              type: string
              example: csv
            headers:
              type: array
              items:
                type: string
            row_count:
              type: integer
            column_count:
              type: integer
            data:
              type: array
              items:
                type: object
      400:
        description: Invalid CSV format
      500:
        description: Server error
    """
    try:
        print(f"📊 Reading CSV blob: {blob_id}")

        # Use walrus_service to read and parse CSV
        result = walrus_service.read_blob_as_csv(blob_id)
        return jsonify(result)

    except ValueError as e:
        print(f"⚠️ CSV validation error: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400
    except Exception as e:
        print(f"❌ Error parsing CSV: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/blob/<blob_id>/metadata', methods=['GET'])
def get_blob_metadata(blob_id):
    """Get blob metadata without downloading content
    ---
    tags:
      - Blob Operations
    parameters:
      - name: blob_id
        in: path
        type: string
        required: true
        description: Walrus blob ID
    responses:
      200:
        description: Metadata retrieved successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            blob_id:
              type: string
            metadata:
              type: object
              description: HTTP headers and metadata from Walrus
      500:
        description: Server error
    """
    try:
        result = walrus_service.get_blob_metadata(blob_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/upload', methods=['POST'])
def upload_blob():
    """Upload a file to Walrus storage
    ---
    tags:
      - Blob Operations
    consumes:
      - multipart/form-data
    parameters:
      - name: file
        in: formData
        type: file
        required: true
        description: File to upload (supports JSON, CSV, and other formats)
      - name: epochs
        in: formData
        type: integer
        required: false
        default: 5
        description: Number of storage epochs (duration) on Walrus
    responses:
      200:
        description: File uploaded successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            blob_id:
              type: string
              description: Unique identifier for the uploaded blob
              example: AiAQDmNUwpxj1boxbJiYmKqdlfpqhd2i25L3ZBLh0ug
            size_bytes:
              type: integer
              description: Size of uploaded file in bytes
            epochs:
              type: integer
              description: Storage duration in epochs
            aggregator_url:
              type: string
              description: Direct URL to access the blob
              example: https://aggregator.walrus-testnet.walrus.space/v1/AiAQDmNUwpxj1boxbJiYmKqdlfpqhd2i25L3ZBLh0ug
      400:
        description: Invalid request (no file or empty filename)
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: false
            error:
              type: string
      500:
        description: Server error (upload failed, timeout, or configuration issue)
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: false
            error:
              type: string
    """
    try:
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({
                "success": False,
                "error": "No file provided"
            }), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({
                "success": False,
                "error": "Empty filename"
            }), 400

        # Get epochs parameter
        epochs = request.form.get('epochs', 5, type=int)

        print(f"📤 Uploading file: {file.filename} (epochs: {epochs})")

        # Get Sui private key from environment
        sui_private_key = os.getenv('SUI_PRIVATE_KEY')
        if not sui_private_key:
            return jsonify({
                "success": False,
                "error": "SUI_PRIVATE_KEY not configured in backend"
            }), 500

        # Read file content
        file_content = file.read()

        # Use walrus_service to upload
        result = walrus_service.upload_blob(
            file_content=file_content,
            filename=file.filename,
            sui_private_key=sui_private_key,
            epochs=epochs
        )

        print(f"✅ Upload successful: {result['blob_id']}")

        return jsonify({
            "success": True,
            **result
        })

    except Exception as e:
        print(f"❌ Upload error: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    print(f"""
🚀 Walrus Analytics API Server Starting...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server: http://localhost:{port}
🔍 Health: http://localhost:{port}/
📥 Read Blob: http://localhost:{port}/api/blob/<blob_id>
📊 CSV Parse: http://localhost:{port}/api/blob/<blob_id>/csv
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
""")
    app.run(host='0.0.0.0', port=port, debug=True)
