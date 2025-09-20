/**
 * Open WebUI Chat Widget - Final Working Version
 * A simple, embeddable chat widget that connects to Open WebUI API
 * 
 * Usage: Include this script in your website and it will automatically
 * create a floating chat button and popup interface.
 */

(function() {
    'use strict';

    // Configuration - Update these values for your setup
    const CONFIG = {
        // Your Open WebUI instance URL
        openWebUIUrl: 'http://108.178.153.147:80',
        
        // Model to use for chat - use the actual model name from your setup
        model: 'hovercam-support', // This is your customized model based on smollm2:360m
        
        // Widget appearance
        position: 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
        theme: 'blue', // 'blue', 'green', 'purple', 'dark'
        
        // Chat settings
        placeholder: 'Ask me anything about Hovercam...',
        welcomeMessage: 'Hello! I\'m your Hovercam support assistant. How can I help you today?',
        
        // API settings
        timeout: 30000, // 30 second timeout
        maxRetries: 3
    };

    // Global state
    let chatWidget = null;
    let authToken = null;
    let chatSession = null;
    let isAuthenticated = false;
    let messageHistory = [];
    let userId = null;

    // Utility functions
    function createUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatTime() {
        return new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    // Authentication functions
    async function authenticateWithOpenWebUI() {
        try {
            console.log('Authenticating with Open WebUI...');
            
            const timestamp = Date.now();
            const userData = {
                name: `ChatWidget${timestamp}`,
                email: `widget${timestamp}@chat.local`,
                password: `pass${timestamp}${Math.random().toString(36).substring(2)}`,
            };

            const response = await fetch(`${CONFIG.openWebUIUrl}/api/v1/auths/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const data = await response.json();
                authToken = data.token;
                userId = data.id;
                isAuthenticated = true;
                console.log('Authentication successful');
                return true;
            } else {
                const errorText = await response.text();
                console.error('Authentication failed:', response.status, errorText);
                return false;
            }
        } catch (error) {
            console.error('Authentication error:', error);
            return false;
        }
    }

    async function sendMessageToOpenWebUI(message) {
        try {
            console.log('Sending message:', message);
            
            // Ensure we're authenticated
            if (!isAuthenticated || !authToken) {
                const authSuccess = await authenticateWithOpenWebUI();
                if (!authSuccess) {
                    throw new Error('Failed to authenticate with the chat service');
                }
            }

            // Prepare headers
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            };

            // Create the request payload using OpenAI-compatible format
            const requestPayload = {
                model: CONFIG.model,
                messages: [
                    ...messageHistory,
                    {
                        role: 'user',
                        content: message
                    }
                ],
                stream: false
            };

            console.log('Request payload:', requestPayload);

            // Send request to Open WebUI
            const response = await fetch(`${CONFIG.openWebUIUrl}/api/chat/completions`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestPayload)
            });

            console.log('API response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API error:', response.status, errorText);
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('API response:', data);

            // Extract response text from OpenAI-compatible format
            let responseText = null;
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                responseText = data.choices[0].message.content;
            } else if (data.message && data.message.content) {
                responseText = data.message.content;
            } else if (data.response) {
                responseText = data.response;
            }

            if (!responseText) {
                console.error('Invalid response format:', data);
                throw new Error('Invalid response format from API');
            }

            // Update conversation history
            messageHistory.push({
                role: 'user',
                content: message
            });
            
            messageHistory.push({
                role: 'assistant',
                content: responseText
            });

            // Keep history manageable (last 10 exchanges)
            if (messageHistory.length > 20) {
                messageHistory = messageHistory.slice(-20);
            }

            return responseText;

        } catch (error) {
            console.error('Message sending error:', error);
            throw error;
        }
    }

    // UI Creation functions
    function createStyles() {
        const styles = `
            .openwebui-chat-widget {
                position: fixed;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .openwebui-chat-button {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: white;
            }
            
            .openwebui-chat-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
            }
            
            .openwebui-chat-popup {
                position: absolute;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                display: none;
                flex-direction: column;
                overflow: hidden;
            }
            
            .openwebui-chat-header {
                padding: 16px;
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: 600;
            }
            
            .openwebui-chat-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .openwebui-chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            
            .openwebui-message {
                max-width: 80%;
                padding: 10px 14px;
                border-radius: 18px;
                font-size: 14px;
                line-height: 1.4;
                word-wrap: break-word;
            }
            
            .openwebui-message-user {
                align-self: flex-end;
                background: #007bff;
                color: white;
                border-bottom-right-radius: 4px;
            }
            
            .openwebui-message-assistant {
                align-self: flex-start;
                background: #f1f3f4;
                color: #333;
                border-bottom-left-radius: 4px;
            }
            
            .openwebui-message-time {
                font-size: 11px;
                opacity: 0.7;
                margin-top: 4px;
            }
            
            .openwebui-chat-input-area {
                padding: 16px;
                border-top: 1px solid #e5e7eb;
                display: flex;
                gap: 8px;
                align-items: flex-end;
            }
            
            .openwebui-chat-input {
                flex: 1;
                border: 1px solid #d1d5db;
                border-radius: 20px;
                padding: 10px 16px;
                font-size: 14px;
                resize: none;
                max-height: 80px;
                min-height: 40px;
                outline: none;
                font-family: inherit;
            }
            
            .openwebui-chat-input:focus {
                border-color: #007bff;
            }
            
            .openwebui-chat-send {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: none;
                background: #007bff;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                transition: background 0.2s;
            }
            
            .openwebui-chat-send:hover:not(:disabled) {
                background: #0056b3;
            }
            
            .openwebui-chat-send:disabled {
                background: #6c757d;
                cursor: not-allowed;
            }
            
            .openwebui-loading {
                display: flex;
                gap: 4px;
                padding: 10px 14px;
                align-self: flex-start;
            }
            
            .openwebui-loading-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #6c757d;
                animation: openwebui-pulse 1.4s ease-in-out infinite both;
            }
            
            .openwebui-loading-dot:nth-child(1) { animation-delay: -0.32s; }
            .openwebui-loading-dot:nth-child(2) { animation-delay: -0.16s; }
            .openwebui-loading-dot:nth-child(3) { animation-delay: 0s; }
            
            @keyframes openwebui-pulse {
                0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                40% { transform: scale(1); opacity: 1; }
            }
            
            .openwebui-position-bottom-right {
                bottom: 20px;
                right: 20px;
            }
            
            .openwebui-position-bottom-left {
                bottom: 20px;
                left: 20px;
            }
            
            .openwebui-position-top-right {
                top: 20px;
                right: 20px;
            }
            
            .openwebui-position-top-left {
                top: 20px;
                left: 20px;
            }
            
            .openwebui-position-bottom-right .openwebui-chat-popup {
                bottom: 70px;
                right: 0;
            }
            
            .openwebui-position-bottom-left .openwebui-chat-popup {
                bottom: 70px;
                left: 0;
            }
            
            .openwebui-position-top-right .openwebui-chat-popup {
                top: 70px;
                right: 0;
            }
            
            .openwebui-position-top-left .openwebui-chat-popup {
                top: 70px;
                left: 0;
            }
            
            .openwebui-theme-blue .openwebui-chat-button { background: #007bff; }
            .openwebui-theme-blue .openwebui-chat-header { background: #007bff; }
            
            .openwebui-theme-green .openwebui-chat-button { background: #28a745; }
            .openwebui-theme-green .openwebui-chat-header { background: #28a745; }
            .openwebui-theme-green .openwebui-message-user { background: #28a745; }
            .openwebui-theme-green .openwebui-chat-send { background: #28a745; }
            .openwebui-theme-green .openwebui-chat-send:hover:not(:disabled) { background: #1e7e34; }
            
            .openwebui-theme-purple .openwebui-chat-button { background: #6f42c1; }
            .openwebui-theme-purple .openwebui-chat-header { background: #6f42c1; }
            .openwebui-theme-purple .openwebui-message-user { background: #6f42c1; }
            .openwebui-theme-purple .openwebui-chat-send { background: #6f42c1; }
            .openwebui-theme-purple .openwebui-chat-send:hover:not(:disabled) { background: #5a32a3; }
            
            .openwebui-theme-dark .openwebui-chat-button { background: #343a40; }
            .openwebui-theme-dark .openwebui-chat-header { background: #343a40; }
            .openwebui-theme-dark .openwebui-message-user { background: #343a40; }
            .openwebui-theme-dark .openwebui-chat-send { background: #343a40; }
            .openwebui-theme-dark .openwebui-chat-send:hover:not(:disabled) { background: #23272b; }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function createChatWidget() {
        const widget = document.createElement('div');
        widget.className = `openwebui-chat-widget openwebui-position-${CONFIG.position} openwebui-theme-${CONFIG.theme}`;
        
        widget.innerHTML = `
            <button class="openwebui-chat-button" id="openwebui-toggle">
                💬
            </button>
            <div class="openwebui-chat-popup" id="openwebui-popup">
                <div class="openwebui-chat-header">
                    <span>Hovercam Support</span>
                    <button class="openwebui-chat-close" id="openwebui-close">×</button>
                </div>
                <div class="openwebui-chat-messages" id="openwebui-messages">
                    <div class="openwebui-message openwebui-message-assistant">
                        ${escapeHtml(CONFIG.welcomeMessage)}
                        <div class="openwebui-message-time">${formatTime()}</div>
                    </div>
                </div>
                <div class="openwebui-chat-input-area">
                    <textarea 
                        class="openwebui-chat-input" 
                        id="openwebui-input" 
                        placeholder="${escapeHtml(CONFIG.placeholder)}"
                        rows="1"></textarea>
                    <button class="openwebui-chat-send" id="openwebui-send">➤</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
        return widget;
    }

    // Event handlers and UI logic
    function setupEventListeners() {
        const toggleBtn = document.getElementById('openwebui-toggle');
        const closeBtn = document.getElementById('openwebui-close');
        const popup = document.getElementById('openwebui-popup');
        const input = document.getElementById('openwebui-input');
        const sendBtn = document.getElementById('openwebui-send');

        toggleBtn.addEventListener('click', () => {
            const isVisible = popup.style.display === 'flex';
            popup.style.display = isVisible ? 'none' : 'flex';
            if (!isVisible) {
                input.focus();
            }
        });

        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        input.addEventListener('input', () => {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 80) + 'px';
        });

        sendBtn.addEventListener('click', sendMessage);
    }

    function addMessage(content, isUser = false, timestamp = null) {
        const messagesContainer = document.getElementById('openwebui-messages');
        const messageDiv = document.createElement('div');
        
        messageDiv.className = `openwebui-message ${isUser ? 'openwebui-message-user' : 'openwebui-message-assistant'}`;
        messageDiv.innerHTML = `
            ${escapeHtml(content)}
            <div class="openwebui-message-time">${timestamp || formatTime()}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return messageDiv;
    }

    function showLoading() {
        const messagesContainer = document.getElementById('openwebui-messages');
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'openwebui-loading';
        loadingDiv.innerHTML = `
            <div class="openwebui-loading-dot"></div>
            <div class="openwebui-loading-dot"></div>
            <div class="openwebui-loading-dot"></div>
        `;
        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return loadingDiv;
    }

    async function sendMessage() {
        const input = document.getElementById('openwebui-input');
        const sendBtn = document.getElementById('openwebui-send');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message to UI
        addMessage(message, true);
        
        // Clear input and disable send button
        input.value = '';
        input.style.height = 'auto';
        sendBtn.disabled = true;
        
        // Show loading animation
        const loadingElement = showLoading();
        
        try {
            // Send message to API
            const response = await sendMessageToOpenWebUI(message);
            
            // Remove loading animation
            loadingElement.remove();
            
            // Add assistant response
            addMessage(response, false);
            
        } catch (error) {
            console.error('Chat error:', error);
            
            // Remove loading animation
            loadingElement.remove();
            
            // Show helpful error message
            let errorMsg;
            if (error.message.includes('authenticate')) {
                errorMsg = 'Unable to connect to the support service. Please check if the service is running and try again.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMsg = 'Network connection error. Please check your internet connection and try again.';
            } else {
                errorMsg = `Sorry, I encountered an error: ${error.message}. Please try again in a moment.`;
            }
            
            addMessage(errorMsg, false);
        } finally {
            sendBtn.disabled = false;
            input.focus();
        }
    }

    // Initialize the widget
    async function initializeChatWidget() {
        try {
            console.log('Initializing Hovercam Support chat widget...');
            
            // Create styles
            createStyles();
            
            // Create widget HTML
            chatWidget = createChatWidget();
            
            // Setup event listeners
            setupEventListeners();
            
            console.log('Hovercam Support chat widget ready!');
            
        } catch (error) {
            console.error('Failed to initialize chat widget:', error);
        }
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChatWidget);
    } else {
        initializeChatWidget();
    }

    // Expose configuration for customization
    window.OpenWebUIChatWidget = {
        config: CONFIG,
        initialize: initializeChatWidget,
        sendMessage: sendMessage,
        addMessage: addMessage
    };

})();