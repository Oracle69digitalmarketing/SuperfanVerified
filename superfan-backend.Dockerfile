# Backend Dockerfile

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy backend requirements
COPY superfan-backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY superfan-backend/ .

# Expose API port
EXPOSE 8000

# Run backend server
CMD ["python", "app.py"]
