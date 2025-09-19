#!/usr/bin/env python3
import paramiko
import sys

def ssh_connect():
    try:
        # Create SSH client
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        # Connect to the server
        print("Connecting to 108.178.153.147...")
        client.connect('108.178.153.147', username='phil', password='phil', timeout=10)
        
        # Execute basic info commands
        commands = [
            'whoami',
            'hostname', 
            'uname -a',
            'docker ps',
            'ps aux | grep ollama',
            'netstat -tlnp | grep 11434 || ss -tlnp | grep 11434',
            'curl -s http://localhost:11434/api/tags || echo "Ollama not responding on localhost:11434"'
        ]
        
        for cmd in commands:
            print(f"\n=== Running: {cmd} ===")
            stdin, stdout, stderr = client.exec_command(cmd)
            output = stdout.read().decode().strip()
            error = stderr.read().decode().strip()
            
            if output:
                print(output)
            if error:
                print(f"Error: {error}")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"SSH connection failed: {e}")
        return False

if __name__ == "__main__":
    ssh_connect()