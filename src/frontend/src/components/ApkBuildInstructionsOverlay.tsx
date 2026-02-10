import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ApkBuildInstructionsOverlayProps {
  open: boolean;
  onClose: () => void;
}

const BUILD_INSTRUCTIONS = `# Android APK Build Guide

This guide explains how to build an Android APK from the Cactus Cowboy Mod Menu web application using Trusted Web Activity (TWA) technology.

## Overview

This web application can be packaged as an Android APK using Google's Bubblewrap tool, which creates a Trusted Web Activity wrapper around the Progressive Web App (PWA).

## Meta Quest 3S / Quest (Android) Notes

**Meta Quest headsets run Android** and can run this app in two ways:

1. **Quest Browser (Recommended for quick access):**
   - Open this web app URL directly in Quest Browser
   - The app works immediately without installation
   - Optionally install as a PWA for offline access

2. **APK/TWA Wrapper (Alternative packaging):**
   - Follow the build instructions below to create an Android APK
   - Install the APK on your Quest headset via sideloading
   - Provides a native app experience with app icon and launcher integration
   - **Prerequisites:** Web app must be deployed via HTTPS and manifest must be accessible at /manifest.webmanifest

**Quest-specific considerations:**
- Quest Browser supports standard web technologies
- Touch interactions work well with Quest controllers
- VR-optimized UI ensures readable text and accessible controls
- Deep-link app switching may have limitations in Quest Browser; APK wrapper provides better app-to-app functionality

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/

2. **Java Development Kit (JDK)** (v11 or higher)
   - Download from: https://adoptium.net/
   - Set JAVA_HOME environment variable

3. **Android SDK Command-line Tools**
   - Download from: https://developer.android.com/studio#command-tools
   - Set ANDROID_HOME environment variable
   - Add $ANDROID_HOME/cmdline-tools/latest/bin to PATH

4. **Bubblewrap CLI**
   npm install -g @bubblewrap/cli

## Step 1: Deploy Your Web App

Before building the APK, ensure your web application is deployed and accessible via HTTPS:

1. Deploy the application to your production environment
2. Note the production URL (e.g., https://your-app-domain.com)
3. Verify the PWA manifest is accessible at /manifest.webmanifest

## Step 2: Initialize Bubblewrap Project

1. Create a new directory for the APK build:
   mkdir cactus-cowboy-apk
   cd cactus-cowboy-apk

2. Initialize the Bubblewrap project:
   bubblewrap init --manifest https://your-app-domain.com/manifest.webmanifest

3. Follow the prompts:
   - Application Name: Cactus Cowboy Mod Menu
   - Package Name: com.cactusgame.modmenu (or your preferred package name)
   - Host: your-app-domain.com
   - Start URL: /
   - Icon URL: Use the 512x512 icon from your manifest
   - Maskable Icon URL: Use the maskable icon from your manifest
   - Theme Color: #d4a574
   - Background Color: #f5ede4
   - Display Mode: standalone
   - Orientation: any

## Step 3: Configure Digital Asset Links

For TWA to work properly, you need to set up Digital Asset Links:

1. Generate SHA-256 fingerprint of your signing key:
   bubblewrap fingerprint

2. Create an assetlinks.json file in your web app's /.well-known/ directory:
   [{
     "relation": ["delegate_permission/common.handle_all_urls"],
     "target": {
       "namespace": "android_app",
       "package_name": "com.cactusgame.modmenu",
       "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT_HERE"]
     }
   }]

3. Deploy this file so it's accessible at:
   https://your-app-domain.com/.well-known/assetlinks.json

## Step 4: Build the APK

1. Build the Android project:
   bubblewrap build

2. The build process will:
   - Download required Android SDK components
   - Generate the Android project
   - Compile the APK
   - Sign the APK with a debug key (for testing)

3. Find the built APK at:
   ./app-release-signed.apk

## Step 5: Test the APK

1. Install the APK on a test device:
   adb install app-release-signed.apk

2. Test the following:
   - App launches correctly
   - PWA loads without errors
   - All features work as expected
   - Digital Asset Links verification (check in Chrome DevTools)

**For Meta Quest testing:**
   - Enable Developer Mode on your Quest headset
   - Use SideQuest or adb to sideload the APK
   - Launch the app from the Quest app library (Unknown Sources)

## Step 6: Production Build

For production release:

1. Generate a production signing key:
   keytool -genkey -v -keystore release-key.keystore -alias cactus-cowboy -keyalg RSA -keysize 2048 -validity 10000

2. Update twa-manifest.json with your signing key details:
   {
     "signingKey": {
       "path": "./release-key.keystore",
       "alias": "cactus-cowboy"
     }
   }

3. Build the production APK:
   bubblewrap build

4. The signed production APK will be generated

## Step 7: Deploy APK for Download

1. Copy the built APK to your web app's assets directory:
   cp app-release-signed.apk /path/to/frontend/public/assets/apk/cactus-cowboy-mod-menu.apk

2. Redeploy your web application

3. The Downloads panel will automatically detect and offer the APK for download

## Android Device Compatibility

The APK is compatible with Android devices (including Meta Quest) running Android 5.0 (Lollipop) or higher. Key features:

- Minimum SDK: 21 (Android 5.0)
- Target SDK: 33 (Android 13)
- Screen Support: All screen sizes and densities
- Orientation: Portrait and landscape

### Android & VR Optimizations

The app includes optimizations for Android devices and VR browsers:
- Touch-friendly UI with 44px minimum touch targets
- Responsive layout for various screen sizes
- Optimized font scaling for readability
- Hardware acceleration enabled
- VR-specific styling for Quest Browser sessions

## Troubleshooting

### Digital Asset Links Not Verified

- Ensure assetlinks.json is accessible via HTTPS
- Verify SHA-256 fingerprint matches your signing key
- Check Chrome DevTools for verification errors

### APK Installation Failed

- Enable "Install from Unknown Sources" in device settings
- For Quest: Enable Developer Mode and use Unknown Sources
- Ensure sufficient storage space
- Check Android version compatibility

### App Crashes on Launch

- Verify the web app URL is accessible
- Check PWA manifest is valid
- Review Android logcat for errors:
  adb logcat | grep -i cactus

### Build Errors

- Ensure all prerequisites are installed
- Update Bubblewrap to the latest version:
  npm update -g @bubblewrap/cli
- Clear build cache and rebuild:
  bubblewrap clean
  bubblewrap build

### Quest-Specific Issues

- **App not appearing in Quest library:** Check Unknown Sources section
- **Controllers not working:** Ensure touch interactions are enabled
- **Text too small:** The app includes VR-optimized styling; ensure latest version
- **Deep links not working:** Use APK wrapper instead of Quest Browser for better app-to-app functionality

## Additional Resources

- Bubblewrap Documentation: https://github.com/GoogleChromeLabs/bubblewrap
- TWA Guide: https://developer.chrome.com/docs/android/trusted-web-activity/
- Digital Asset Links: https://developers.google.com/digital-asset-links
- Android Developer Guide: https://developer.android.com/guide
- Meta Quest Developer Hub: https://developer.oculus.com/

## Support

For issues specific to the Cactus Cowboy Mod Menu app, please refer to the main project documentation or contact the development team.

---

Note: This build process creates a wrapper around the web application. The actual app logic runs in the web environment, so ensure your web app is always accessible and up-to-date.`;

export function ApkBuildInstructionsOverlay({ open, onClose }: ApkBuildInstructionsOverlayProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl sm:text-2xl font-black text-[oklch(0.45_0.15_45)]">
                Android APK Build Instructions
              </DialogTitle>
              <DialogDescription className="mt-2">
                Step-by-step guide to build and deploy your Android APK (including Meta Quest)
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6 pb-6">
          <pre className="text-sm sm:text-base whitespace-pre-wrap font-mono leading-relaxed text-foreground/90">
            {BUILD_INSTRUCTIONS}
          </pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
