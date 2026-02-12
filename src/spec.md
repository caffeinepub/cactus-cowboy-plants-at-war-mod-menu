# Specification

## Summary
**Goal:** Replace the current browser-only UI with an English Mod Menu page for “Cactus Cowboy: Plants at War” that lets authenticated users configure and persist mod settings, select a target process, and manage spawn lists (items and prefabs), with optional rainbow background styling and a game cover image.

**Planned changes:**
- Create a new Mod Menu page as the primary app UI (replacing the BrowserPage-only/iframe UI).
- Add Mod Menu controls for: Fly, Super Speed (with multiplier), Super Jump (with multiplier), Disable Monsters, and Rainbow Background.
- Persist mod settings per user using Internet Identity authentication; restore settings on refresh/login and reflect state in the ModStatusBar (including multiplier values and a “NO MONSTERS” badge).
- Add a Process Selector panel that uses existing backend APIs to list/refresh available processes, select one, persist selection, and indicate when a previously selected process is missing.
- Implement an Item Spawner tool: user-managed item list (add/remove/clear), persistence per user, and a UI log/history of spawn actions.
- Implement a Prefab Spawner: browse/search a prefab catalog “from the game”, allow adding prefabs to the spawn list and/or spawning directly, and persist chosen prefab entries per user.
- Update backend canister Candid types/APIs so stored user profile fields match the Mod Menu features (Fly, Super Speed, Super Jump, Disable Monsters) and wire frontend read/write end-to-end.
- Add and display a responsive “Cactus Cowboy: Plants at War” cover image (static asset under `frontend/public/assets/generated`) in the Mod Menu header/hero area with English alt text.

**User-visible outcome:** On launch, users see a Mod Menu page where they can toggle and tune movement cheats, disable monsters, enable a rainbow background, pick a process, manage item/prefab spawn lists with a spawn log, and see a game cover image; all settings are saved to their profile and restored after reload/login.
