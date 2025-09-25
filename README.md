# 🎯 Trivia Chalkboard Android App

[![APK Download](https://img.shields.io/badge/📱%20Download-APK-green.svg)](https://github.com/philsmcc/test-apk/raw/main/TriviaChalkboard.apk)
[![Android](https://img.shields.io/badge/Android-5.0%2B-brightgreen.svg)](https://android.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A full-screen Android WebView app that displays interactive trivia games. Perfect for educational environments, entertainment, and kiosk applications.

## 📱 Download APK

Click to download the ready-to-install Android app:

### **🎯 [TriviaChalkboard.apk](https://github.com/philsmcc/test-apk/raw/main/TriviaChalkboard.apk)** ⬇️
**Recommended** - Latest version with trivia game (3.2MB)

### Alternative Versions:
- **[TriviaWebViewApp.apk](https://github.com/philsmcc/test-apk/raw/main/TriviaWebViewApp.apk)** - Intermediate version (3.0MB)
- **[WebViewApp.apk](https://github.com/philsmcc/test-apk/raw/main/WebViewApp.apk)** - Generic WebView app (3.0MB)

## 🚀 Quick Start

1. **Download** `TriviaChalkboard.apk` from the links above
2. **Enable** "Unknown Sources" in Android Settings → Security
3. **Install** the APK file on your Android device
4. **Launch** "Trivia Chalkboard" and start playing!

## 🎮 What It Does

- **📱 Full-Screen Experience**: Launches directly into the trivia game with no Android UI
- **🎯 Interactive Trivia**: 20-second trivia chalkboard game
- **📚 Educational Content**: Perfect for learning environments
- **🎨 Responsive Design**: Works on phones and tablets
- **⚡ Instant Access**: No app store required, direct APK install

## 🔧 Features

- ✅ **WebView Integration** - Uses Android's Chrome WebView engine
- ✅ **JavaScript Support** - Full HTML5, CSS3, and JS compatibility
- ✅ **Touch Interactions** - Complete touch and gesture support
- ✅ **Offline Ready** - Cached content works without internet*
- ✅ **Performance Optimized** - Smooth gameplay experience
- ✅ **Universal Compatibility** - Android 5.0+ (API 21-33)

## 📋 System Requirements

- **Operating System**: Android 5.0 (API 21) or higher
- **RAM**: 2GB+ recommended
- **Storage**: 50MB available space
- **Network**: Internet connection for initial load
- **Permissions**: Internet, Camera, Location (for web features)

## 🛠️ Installation Methods

### Method 1: Direct APK Install (Recommended)
```bash
# Via ADB (fastest)
adb install TriviaChalkboard.apk

# Or manual install on device
1. Download APK to device
2. Enable "Unknown Sources" 
3. Tap APK file to install
```

### Method 2: Cloud Transfer
1. Upload APK to Google Drive/Dropbox
2. Download on Android device
3. Install as above

## 🎯 Use Cases

### 🏫 Educational
- Classroom quiz sessions
- Interactive learning games
- Student engagement tools
- Training assessments

### 🎉 Entertainment
- Party games and icebreakers
- Team building activities
- Quick brain teasers
- Waiting room entertainment

### 💼 Professional
- Kiosk applications
- Trade show interactions
- Corporate training
- Customer engagement tools

## 🔧 Customization

The app is built from source code in this repository. To customize:

### Change Website URL
Edit `android-webview-app/app/src/main/java/com/test/webviewapp/MainActivity.java`:
```java
private static final String DEFAULT_URL = "https://your-website-here.com";
```

### Change App Name
Edit `android-webview-app/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">Your App Name</string>
```

### Rebuild APK
```bash
cd android-webview-app
./gradlew assembleDebug
```

## 📁 Repository Structure

```
├── TriviaChalkboard.apk          # 🎯 Main APK (recommended)
├── TriviaWebViewApp.apk          # Alternative version
├── WebViewApp.apk                # Generic version
├── android-webview-app/          # 📱 Android Studio project
│   ├── app/src/main/
│   │   ├── java/                 # Java source code
│   │   ├── res/                  # Android resources
│   │   └── AndroidManifest.xml   # App configuration
│   ├── build.gradle              # Build configuration
│   └── gradlew                   # Gradle wrapper
├── TRIVIA_APP_README.md          # 📚 Detailed app guide
├── APK_INSTALLATION_GUIDE.md     # 🔧 Installation instructions
└── README.md                     # This file
```

## 🐛 Troubleshooting

### Installation Issues
- **Enable "Unknown Sources"** in Security settings
- **Check available storage** (need ~50MB)
- **Try ADB install** if manual fails: `adb install TriviaChalkboard.apk`

### Runtime Issues
- **Game won't load**: Check internet connection
- **App crashes**: Clear app data or reinstall
- **Touch issues**: Restart app or device
- **Slow performance**: Close background apps

## 📞 Support

For issues or questions:
1. Check the [Installation Guide](APK_INSTALLATION_GUIDE.md)
2. Review [Trivia App Documentation](TRIVIA_APP_README.md)
3. Verify device compatibility (Android 5.0+)
4. Check device logs: `adb logcat | grep WebView`

## 🤝 Contributing

1. Fork this repository
2. Make your changes to the Android project
3. Test on Android devices
4. Submit a pull request

## 📄 License

This project is open source. Feel free to modify and distribute according to your needs.

---

## 🎉 Ready to Play!

**[⬇️ Download TriviaChalkboard.apk](https://github.com/philsmcc/test-apk/raw/main/TriviaChalkboard.apk)** and start your trivia adventure!

Made with ❤️ for interactive learning and entertainment.