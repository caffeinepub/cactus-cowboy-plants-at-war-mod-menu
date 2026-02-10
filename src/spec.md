# Specification

## Summary
**Goal:** Make the app runnable and comfortable to use on Meta Quest 3S by adding Quest-specific guidance, accurate Android/APK wording, Quest-aware environment detection, and VR-browser-friendly UI scaling.

**Planned changes:**
- Add a clearly labeled UI section (or extend existing Downloads/instructions) that mentions Meta Quest 3S by name and explains running the app via Quest Browser as a PWA, plus the Android APK/TWA wrapper option and prerequisites (HTTPS + `/manifest.webmanifest`).
- Update Downloads panel APK messaging to remove any Samsung-only wording and explicitly include Meta Quest headsets as supported Android devices, keeping the APK link path `/assets/apk/cactus-cowboy-mod-menu.apk` unchanged.
- Extend the in-app build instructions overlay with a distinct “Meta Quest 3S / Quest (Android) Notes” section while keeping the existing Bubblewrap/TWA steps intact.
- Improve client-side runtime detection to recognize Quest Browser sessions and show Quest-relevant messaging (avoid misleading “not Android” warnings; provide clear guidance when a feature is unsupported).
- Add VR-friendly layout/accessibility adjustments for Quest Browser (readable base text, safe tap targets, reliable scrolling and unclipped UI) without changing the overall feature set.
- Add/confirm appropriate viewport metadata in the HTML shell so the UI scales correctly in mobile/VR browsers like Quest Browser.

**User-visible outcome:** Users on Meta Quest 3S can open the app in Quest Browser with clear on-screen instructions, see accurate Android/APK download guidance that includes Quest devices, and use a VR-friendly UI that scales and behaves correctly in the headset browser.
