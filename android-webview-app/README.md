# Android WebView App

A simple Android application that loads a website in full-screen mode using WebView. This app is designed to display any website as a native-looking Android app.

## 📱 Features

- **Full-Screen Display**: The website loads in complete full-screen mode with no UI bars
- **WebView Integration**: Uses Android's WebView component for optimal web rendering
- **JavaScript Support**: Full JavaScript functionality enabled
- **Responsive Design**: Works on all Android screen sizes and orientations
- **Navigation Controls**: Back button navigates through web history
- **Permissions**: Supports camera, microphone, and location permissions for web features
- **Modern Web Standards**: Support for HTML5, CSS3, and modern web APIs

## 🔧 Installation & Setup

### Prerequisites

- **Android Studio** (4.0 or later)
- **Android SDK** (API level 21 or higher)
- **Java Development Kit** (JDK 8 or later)

### Build Instructions

1. **Open the Project**:
   ```bash
   # Open Android Studio and select "Open an existing project"
   # Navigate to the android-webview-app folder
   ```

2. **Add App Icons** (Optional but recommended):
   - Follow instructions in `app/src/main/res/ICON_INSTRUCTIONS.txt`
   - Add launcher icons to the appropriate mipmap folders

3. **Configure the Website URL**:
   - Open `MainActivity.java`
   - Find the line: `private static final String WEBSITE_URL = DEFAULT_URL;`
   - Change `DEFAULT_URL` to your desired website:
     ```java
     private static final String WEBSITE_URL = "https://your-website.com";
     ```

4. **Build the App**:
   ```bash
   # In Android Studio:
   # Build -> Build Bundle(s) / APK(s) -> Build APK(s)
   ```

   Or using command line:
   ```bash
   cd android-webview-app
   ./gradlew assembleDebug
   ```

5. **Install on Device**:
   ```bash
   # Enable USB debugging on your Android device
   # Connect device and run:
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

## 📋 Configuration Options

### Website URL
Change the website that loads by modifying `WEBSITE_URL` in `MainActivity.java`:
```java
private static final String WEBSITE_URL = "https://example.com";
```

### App Name
Change the app name in `app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">Your App Name</string>
```

### Package Name
To change the package name:
1. Rename the package in `AndroidManifest.xml`
2. Rename the Java package directory structure
3. Update the `applicationId` in `app/build.gradle`

### Theme Colors
Modify colors in `app/src/main/res/values/colors.xml`:
```xml
<color name="colorPrimary">#your_color</color>
<color name="colorPrimaryDark">#your_dark_color</color>
```

## 🔒 Permissions

The app requests the following permissions:

- **INTERNET**: Required to load websites
- **ACCESS_NETWORK_STATE**: Check network connectivity
- **CAMERA**: For websites that use camera features
- **RECORD_AUDIO**: For websites that use microphone
- **ACCESS_FINE_LOCATION**: For location-based web features
- **ACCESS_COARSE_LOCATION**: For basic location services

## 📁 Project Structure

```
android-webview-app/
├── app/
│   ├── build.gradle                    # App-level build configuration
│   ├── proguard-rules.pro             # ProGuard rules for code obfuscation
│   └── src/main/
│       ├── AndroidManifest.xml         # App manifest with permissions
│       ├── java/com/test/webviewapp/
│       │   └── MainActivity.java       # Main app logic
│       └── res/
│           ├── layout/
│           │   └── activity_main.xml   # WebView layout
│           ├── values/
│           │   ├── colors.xml          # App colors
│           │   ├── strings.xml         # App strings
│           │   └── styles.xml          # App themes
│           ├── mipmap-*/               # App icons (various densities)
│           └── ICON_INSTRUCTIONS.txt   # Instructions for adding icons
├── build.gradle                       # Project-level build configuration
├── gradle.properties                  # Gradle configuration
├── settings.gradle                    # Project settings
└── README.md                          # This file
```

## 🛠️ Customization

### Adding Custom JavaScript Interface
To add JavaScript interfaces for communication between web and native:

```java
// In MainActivity.java, add to setupWebView():
webView.addJavascriptInterface(new WebAppInterface(this), "Android");

// Create interface class:
public class WebAppInterface {
    Context mContext;
    
    WebAppInterface(Context c) {
        mContext = c;
    }
    
    @JavascriptInterface
    public void showToast(String toast) {
        Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
    }
}
```

### Custom Loading Screen
Add a loading screen while the website loads:

```xml
<!-- In activity_main.xml, add before WebView -->
<ProgressBar
    android:id="@+id/progressBar"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:layout_centerInParent="true" />
```

### Handle Network Errors
Customize error handling in the `WebViewClient`:

```java
@Override
public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
    // Load custom error page or show retry option
    view.loadUrl("file:///android_asset/error.html");
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Website not loading**:
   - Check internet permission in AndroidManifest.xml
   - Verify the website URL is correct and accessible
   - Check if `usesCleartextTraffic="true"` is set for HTTP sites

2. **JavaScript not working**:
   - Ensure `setJavaScriptEnabled(true)` is called
   - Check console for JavaScript errors

3. **Fullscreen not working**:
   - Verify fullscreen flags in `setupFullScreen()` method
   - Check that the theme extends `NoActionBar`

4. **Build errors**:
   - Sync project with Gradle files
   - Check that all dependencies are correctly specified
   - Ensure minimum SDK version is 21 or higher

### Debug Mode
Enable WebView debugging:
```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    WebView.setWebContentsDebuggingEnabled(true);
}
```

## 📱 Supported Android Versions

- **Minimum SDK**: API 21 (Android 5.0 Lollipop)
- **Target SDK**: API 33 (Android 13)
- **Compile SDK**: API 33

## 🔄 Updates and Maintenance

To update the website content, you can:

1. **Change URL**: Modify `WEBSITE_URL` in MainActivity.java
2. **Remote Configuration**: Implement remote config to change URL without app updates
3. **Local HTML**: Store HTML files in assets folder and load with `file:///android_asset/`

## 📄 License

This project is provided as-is for educational and testing purposes. Feel free to modify and use according to your needs.

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly on different devices
5. Submit a pull request

---

**Made with ❤️ for Android WebView applications**