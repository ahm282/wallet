#!/bin/sh
set -e

echo "Checking if database 'wallet' exists..."

# Remove any unwanted whitespace from INSIGHTS_DB_NAME
DB_NAME=$(echo "${INSIGHTS_DB_NAME}" | tr -d '[:space:]')

BASE_URI=$(echo "${POSTGRES_URI}" | sed "s/${DB_NAME}$/postgres/")

if ! psql "${BASE_URI}" -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
    echo "Database '${DB_NAME}' does not exist. Creating it..."
    createdb "${BASE_URI}" "${DB_NAME}"
else
    echo "Database '${DB_NAME}' already exists."
fi

echo "Running Alembic migrations..."
alembic upgrade head

echo "Starting Uvicorn server..."
exec uvicorn main:app --host 0.0.0.0 --port ${INSIGHTS_PORT} --log-level debug
