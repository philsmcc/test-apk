# 📺 Android TV Stick Compatibility Guide

## 🔧 Updated APK for Android TV Sticks

**New APK**: `TriviaChalkboard.apk` now includes Android TV stick specific optimizations for better CSS rendering on Android 10 and TV devices.

## 🎯 What's Different in TV Stick Version

### 🚫 **Disabled for TV Sticks (Android 10 and below)**:
- Hardware acceleration (often problematic on TV sticks)
- Advanced WebView debugging 
- Complex viewport settings
- Aggressive caching
- Advanced CSS layout algorithms

### ✅ **Enabled for TV Sticks**:
- Software rendering (more stable)
- Conservative WebView settings
- Simplified CSS injection
- Force refresh content (no cache)
- Basic layout algorithm
- TV-compatible user agent

## 📱 Installation for Android TV Sticks

### Method 1: ADB Install (Recommended)
```bash
# Download the APK
wget https://github.com/philsmcc/test-apk/raw/main/TriviaChalkboard.apk

# Install via ADB
adb connect YOUR_TV_STICK_IP:5555  # Enable ADB over network first
adb install TriviaChalkboard.apk
```

### Method 2: File Manager Install
1. Copy APK to USB drive
2. Connect USB to TV stick
3. Open file manager on TV stick
4. Navigate to USB drive
5. Install TriviaChalkboard.apk
6. Enable "Unknown Sources" if prompted

### Method 3: Downloader App
1. Install "Downloader" app on TV stick
2. Enter URL: `https://github.com/philsmcc/test-apk/raw/main/TriviaChalkboard.apk`
3. Download and install

## 🛠️ Additional TV Stick Troubleshooting

### If CSS Still Not Working:

#### 1. **Update Android System WebView**
```bash
# Check current WebView version
adb shell pm list packages | grep webview

# Try to update via Play Store (if available)
# Or sideload newer WebView APK
```

#### 2. **Clear WebView Data**
```bash
# Clear WebView app data
adb shell pm clear com.google.android.webview
adb shell pm clear com.android.webview
```

#### 3. **Check Available Memory**
```bash
# Check available memory
adb shell cat /proc/meminfo | grep MemAvailable
# TV sticks often have limited RAM (1-2GB)
```

#### 4. **Force Software Rendering**
The TV stick version already does this, but you can verify:
- App will use `LAYER_TYPE_SOFTWARE` instead of hardware acceleration
- More stable but potentially slower

### 🔍 **Debug CSS Issues on TV Stick**

Since Chrome DevTools might not work, try these methods:

#### Method 1: Test in TV Browser
1. Open Chrome/Firefox on the TV stick
2. Navigate to your trivia website
3. See if CSS renders correctly in browser
4. If browser works but app doesn't, it's a WebView issue

#### Method 2: Simplify CSS
1. Create a test version of your website with simpler CSS
2. Remove complex animations, transforms, flexbox
3. Use basic HTML table layouts instead
4. Test if basic version works

#### Method 3: Check WebView Version
```bash
# Get WebView version info
adb shell dumpsys package com.google.android.webview | grep version
```

## 📊 TV Stick Limitations

### **Common Issues**:
- **Limited RAM**: 1-2GB total memory
- **Slow CPU**: ARM Cortex-A series, often older
- **Old WebView**: May be stuck on older Chrome versions
- **GPU Issues**: Limited or problematic hardware acceleration
- **Thermal Throttling**: Performance drops when hot

### **Workarounds**:
- ✅ Use software rendering (implemented)
- ✅ Disable complex CSS features
- ✅ Force content refresh
- ✅ Simplify viewport settings
- ✅ Use conservative JavaScript

## 🎯 CSS Compatibility Tips

### **TV Stick Friendly CSS**:
```css
/* Avoid complex transforms */
.element {
    /* Instead of: transform: rotate(45deg) scale(1.2); */
    /* Use: simple positioning */
    position: relative;
    top: 10px;
    left: 10px;
}

/* Use simple animations */
.fade {
    /* Instead of: complex keyframes */
    /* Use: simple opacity transition */
    transition: opacity 0.3s ease;
}

/* Avoid flexbox complexity */
.container {
    /* Instead of: display: flex; complex flex rules */
    /* Use: float or table-cell */
    display: table;
}
```

### **Test Website Simplification**:
1. Remove CSS animations temporarily
2. Use basic colors instead of gradients
3. Replace flexbox with simple divs/tables
4. Remove CSS transforms and 3D effects
5. Use web-safe fonts only

## 🚀 Expected Results

With the TV stick compatible APK, you should see:
- ✅ Proper text rendering
- ✅ Correct colors and basic styling
- ✅ Functional buttons and interactions
- ✅ Stable performance without crashes
- ❓ Some advanced CSS effects may be simplified

## 📞 If Still Not Working

If the TV stick compatible APK still has CSS issues:

1. **Try the website in TV stick browser first**
2. **Check if WebView can be updated**
3. **Consider creating a simplified version of your trivia website**
4. **Test with a basic HTML page first**

The TV stick version prioritizes stability and basic functionality over advanced CSS effects.