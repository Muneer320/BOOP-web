# Dockerfile for BOOP Web Backend
# Uses Python slim image
FROM python:3.10-slim

# Set working directory
WORKDIR /app
RUN mkdir -p /app/outputs && chmod -R a+rw /app/outputs

# Install system dependencies (if any)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
 && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .
RUN chmod -R 777 /app

# Expose port for Hugging Face Spaces
EXPOSE 7860

# Start the FastAPI server on port 7860
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
