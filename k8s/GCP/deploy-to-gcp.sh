#!/bin/bash
set -e

# Make sure we're connected to the right cluster
echo "Checking connection to GCP cluster..."
kubectl config current-context

# Create all resources
echo "Creating Kubernetes resources..."

# Apply resources in order
kubectl apply -f 01-namespace.yaml
kubectl apply -f 02-configmap.yaml
kubectl apply -f 03-secrets.yaml
kubectl apply -f 04-storage-class.yaml

# Deploy database layer
kubectl apply -f 10-user-db.yaml
kubectl apply -f 11-finance-db.yaml
kubectl apply -f 12-insights-db.yaml

# Wait for databases to be ready
echo "Waiting for databases to initialize (30 seconds)..."
sleep 30

# Deploy application layer
kubectl apply -f 05-frontend.yaml
kubectl apply -f 06-api-gateway.yaml
kubectl apply -f 07-user-service.yaml
kubectl apply -f 08-finance-service.yaml
kubectl apply -f 09-insights-service.yaml

# Deploy ingress
kubectl apply -f 13-ingress.yaml

# Check deployment status
echo "Checking pod status..."
kubectl get pods -n wallet

echo "Checking services..."
kubectl get services -n wallet

echo "Checking ingress..."
kubectl get ingress -n wallet

echo "Deployment complete!"