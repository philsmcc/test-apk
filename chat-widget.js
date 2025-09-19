/**
 * Open WebUI Chat Widget
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
        
        // Model to use for chat (customize this to your model)
        model: 'smollm2:360m',
        
        // Widget appearance
        position: 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
        theme: 'blue', // 'blue', 'green', 'purple', 'dark'
        
        // Chat settings
        placeholder: 'Ask me anything...',
        welcomeMessage: 'Hello! How can I help you today?',
        
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

    // API functions
    async function authenticateWithOpenWebUI() {
        try {
            // First, check if we need authentication
            const configResponse = await fetch(`${CONFIG.openWebUIUrl}/api/config`);
            const configData = await configResponse.json();
            
            if (configData.onboarding) {
                // In onboarding mode, we might need to create a user first
                console.log('Open WebUI is in onboarding mode');
                return await createTempUser();
            }
            
            if (!configData.features.auth) {
                // No authentication required
                isAuthenticated = true;
                return true;
            }
            
            // Try to authenticate or create a session
            return await createTempUser();
            
        } catch (error) {
            console.error('Authentication error:', error);
            return false;
        }
    }

    async function createTempUser() {
        try {
            // Try to create a temporary user for the chat session
            const userData = {
                name: `Chat User ${Date.now()}`,
                email: `chatuser${Date.now()}@temp.local`,
                password: `temp_${createUUID()}`,
                role: 'user'
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
                isAuthenticated = true;
                return true;
            } else {
                // Signup might be disabled, try to use without auth
                console.log('Signup failed, trying without authentication');
                isAuthenticated = true;
                return true;
            }
        } catch (error) {
            console.error('User creation error:', error);
            // Fall back to unauthenticated mode
            isAuthenticated = true;
            return true;
        }
    }

    async function sendMessageToOpenWebUI(message) {
        try {
            const headers = {
                'Content-Type': 'application/json',
            };
            
            if (authToken) {
                headers['Authorization'] = `Bearer ${authToken}`;
            }

            // Create chat session if not exists
            if (!chatSession) {
                chatSession = createUUID();
            }

            const requestBody = {
                model: CONFIG.model,
                messages: [
                    ...messageHistory,
                    {
                        role: 'user',
                        content: message
                    }
                ],
                stream: false,
                chat_id: chatSession
            };

            const response = await fetch(`${CONFIG.openWebUIUrl}/ollama/api/chat`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // Add messages to history
            messageHistory.push({
                role: 'user',
                content: message
            });
            
            if (data.message && data.message.content) {
                messageHistory.push({
                    role: 'assistant',
                    content: data.message.content
                });
                return data.message.content;
            }
            
            throw new Error('Invalid response format');
            
        } catch (error) {
            console.error('API Error:', error);
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
            
            /* Position classes */
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
            
            /* Theme colors */
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
                    <span>Chat Support</span>
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
            // Auto-resize textarea
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
            
            // Show error message
            addMessage('Sorry, I encountered an error. Please try again.', false);
        } finally {
            sendBtn.disabled = false;
            input.focus();
        }
    }

    // Initialize the widget
    async function initializeChatWidget() {
        try {
            // Create styles
            createStyles();
            
            // Create widget HTML
            chatWidget = createChatWidget();
            
            // Setup event listeners
            setupEventListeners();
            
            // Authenticate with Open WebUI
            console.log('Initializing Open WebUI chat widget...');
            await authenticateWithOpenWebUI();
            console.log('Chat widget ready!');
            
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