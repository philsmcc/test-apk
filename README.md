# Open WebUI Chat Widget

A simple, embeddable chat widget that connects to your Open WebUI instance, allowing you to add AI chat functionality to any website.

## 🚀 Quick Start

### 1. Basic Integration

Simply include the JavaScript file in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <!-- Your website content -->
    
    <!-- Add the chat widget -->
    <script src="chat-widget.js"></script>
</body>
</html>
```

That's it! The chat widget will automatically appear in the bottom-right corner.

### 2. Configuration

Before using, update the configuration at the top of `chat-widget.js`:

```javascript
const CONFIG = {
    // Your Open WebUI instance URL
    openWebUIUrl: 'http://108.178.153.147:80',
    
    // Model to use for chat (your customized model)
    model: 'smollm2:360m',
    
    // Widget appearance
    position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    theme: 'blue', // blue, green, purple, dark
    
    // Chat settings
    placeholder: 'Ask me anything...',
    welcomeMessage: 'Hello! How can I help you today?',
};
```

## 🎨 Customization

### Themes

Choose from 4 built-in themes:
- `blue` (default) - Professional blue theme
- `green` - Nature-inspired green theme  
- `purple` - Creative purple theme
- `dark` - Sleek dark theme

### Positioning

Position the widget anywhere on the page:
- `bottom-right` (default)
- `bottom-left`
- `top-right` 
- `top-left`

### Custom Styling

The widget uses CSS classes prefixed with `openwebui-` to avoid conflicts. You can override styles:

```css
.openwebui-chat-button {
    background: #your-color !important;
}

.openwebui-chat-popup {
    width: 400px !important; /* Make wider */
}
```

## 📋 Features

- ✅ **Easy Integration** - Just one script tag
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Auto Authentication** - Handles Open WebUI authentication automatically
- ✅ **Session Management** - Maintains conversation history
- ✅ **Customizable Themes** - Multiple color schemes
- ✅ **Flexible Positioning** - Place anywhere on the page
- ✅ **Error Handling** - Graceful error messages
- ✅ **Loading States** - Visual feedback during API calls
- ✅ **No Dependencies** - Pure vanilla JavaScript

## 🔧 Advanced Usage

### Programmatic Control

```javascript
// Send a message programmatically
window.OpenWebUIChatWidget.sendMessage();

// Add a message to the chat
window.OpenWebUIChatWidget.addMessage('Hello from JavaScript!', false);

// Access the configuration
console.log(window.OpenWebUIChatWidget.config);

// Re-initialize if needed
window.OpenWebUIChatWidget.initialize();
```

### Custom Event Handling

The widget exposes functions you can use in your own code:

```javascript
// Listen for when the widget is ready
document.addEventListener('DOMContentLoaded', function() {
    // Widget is now available
    if (window.OpenWebUIChatWidget) {
        console.log('Chat widget loaded!');
    }
});
```

## 🛠️ Setup Requirements

### Open WebUI Instance
- Running Open WebUI instance (yours: `http://108.178.153.147:80`)
- Accessible model (yours: `smollm2:360m`)
- CORS enabled for your domain (Open WebUI handles this automatically)

### Website Requirements
- Modern web browser with JavaScript enabled
- HTTPS recommended for production use
- No other dependencies required

## 🌐 CORS and Security

The widget handles authentication automatically:

1. **Onboarding Mode**: Creates temporary user if in onboarding
2. **Auth Disabled**: Works without authentication
3. **Auth Enabled**: Attempts to create session or use existing auth

For production use:
- Use HTTPS for your website and Open WebUI
- Configure proper CORS settings in Open WebUI
- Consider rate limiting and authentication requirements

## 🔍 Troubleshooting

### Widget Not Appearing
- Check browser console for JavaScript errors
- Ensure `chat-widget.js` is loading correctly
- Verify Open WebUI URL is accessible

### API Connection Issues
- Check Open WebUI is running: `http://108.178.153.147:80`
- Verify model name: `smollm2:360m`
- Check browser network tab for failed requests
- Ensure CORS is properly configured

### Authentication Problems
- Try refreshing the page to reset session
- Check Open WebUI authentication settings
- Verify the model is loaded and accessible

### Performance Issues
- Check Open WebUI server resources
- Monitor network latency
- Consider reducing message history length

## 📁 File Structure

```
chat-widget.js          # Main widget script
chat-widget-demo.html   # Demo page
README.md              # This documentation
```

## 🎯 Integration Examples

### Basic Website
```html
<script src="chat-widget.js"></script>
```

### WordPress
Add to your theme's `functions.php`:
```php
function add_chat_widget() {
    wp_enqueue_script('chat-widget', get_template_directory_uri() . '/js/chat-widget.js', array(), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'add_chat_widget');
```

### React/Vue/Angular
```javascript
// In your component
useEffect(() => {
    const script = document.createElement('script');
    script.src = '/chat-widget.js';
    document.body.appendChild(script);
}, []);
```

## 🚀 Demo

You can see the widget in action at: **http://108.178.153.147:8000/chat-widget-demo.html**

The demo page shows all features and provides integration examples.

## 📄 License

This chat widget is open source. Feel free to modify and customize for your needs.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify your Open WebUI instance is running
3. Check browser console for error messages
4. Test with the demo page first

---

**Happy chatting! 🤖💬**