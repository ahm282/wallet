FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl postgresql-client && rm -rf /var/lib/apt/lists/*

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Copy the entrypoint script
COPY alembic_entrypoint.sh /alembic_entrypoint.sh
RUN chmod +x /alembic_entrypoint.sh

# Healthcheck (ensure that INSIGHTS_PORT is set in your environment)
HEALTHCHECK --interval=30s --timeout=30s --start-period=30s --retries=3 \
    CMD curl --fail http://localhost:${INSIGHTS_PORT}/api/v1/insights/ || exit 1

# Use the entrypoint script as the container command
CMD ["/alembic_entrypoint.sh"]
