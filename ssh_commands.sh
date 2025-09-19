#!/bin/bash

# Create a simple SSH connection script
echo "Attempting SSH connection to 108.178.153.147..."

# Try using SSH with password (this might prompt for password)
ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no phil@108.178.153.147 << 'ENDSSH'
echo "=== Connected to $(hostname) ==="
echo "=== Checking Ollama port binding ==="
netstat -tlnp | grep 11434 || ss -tlnp | grep 11434 || echo "Port 11434 not found in netstat/ss"

echo "=== Testing Ollama locally ==="
curl -s http://localhost:11434/api/tags || echo "Ollama not responding on localhost:11434"

echo "=== Checking Docker containers ==="
docker ps

echo "=== Checking Open WebUI logs (last 10 lines) ==="
docker logs --tail 10 open-webui

echo "=== Stopping Ollama to reconfigure ==="
killall ollama

echo "=== Setting Ollama to listen on all interfaces ==="
export OLLAMA_HOST=0.0.0.0:11434
echo "OLLAMA_HOST set to: $OLLAMA_HOST"

echo "=== Starting Ollama in background ==="
nohup ollama serve > ollama.log 2>&1 &
sleep 3

echo "=== Verifying Ollama is accessible on all interfaces ==="
curl -s http://localhost:11434/api/tags && echo "Local access: OK" || echo "Local access: FAILED"
curl -s http://108.178.153.147:11434/api/tags && echo "External access: OK" || echo "External access: FAILED"

echo "=== Restarting Open WebUI with correct config ==="
docker stop open-webui
docker rm open-webui

docker run -d \
  --name open-webui \
  -p 80:8080 \
  -v open-webui:/app/backend/data \
  -e OLLAMA_BASE_URL=http://108.178.153.147:11434 \
  ghcr.io/open-webui/open-webui:main

echo "=== Checking new container status ==="
sleep 5
docker ps
docker logs --tail 5 open-webui

echo "=== Testing connection from container ==="
docker exec open-webui curl -s http://108.178.153.147:11434/api/tags && echo "Container can reach Ollama: OK" || echo "Container can reach Ollama: FAILED"

exit
ENDSSH