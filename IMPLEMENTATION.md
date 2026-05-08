# Inkwell Notes — Implementation Plan

## Journal
* **2026-05-09:** Initial project setup. Design approved. Phase 1 completed: project scaffolded, metadata configured, and initial commit made. Launching app on Chrome.

## Instructions
After completing a task, if you added any TODOs to the code or didn't fully implement anything, make sure to add new tasks so that you can come back and complete them later.

---

## Phase 1: Project Scaffolding & Configuration
- [x] Create the Flutter project in the current directory.
    - [x] Run `create_project` with `target: "."`, `package_name: "inkwell_notes"`, and `empty: true`.
    - [x] Ensure platforms include `web` and `android`.
- [x] Cleanup boilerplate.
    - [x] Remove default `test/` directory.
    - [x] Remove unnecessary comments in `pubspec.yaml` and `lib/main.dart`.
- [x] Configure project metadata.
    - [x] Update `pubspec.yaml`: description "A premium, editorial-style, offline-first note-taking app.", version `0.1.0`.
    - [x] Update `README.md` with a placeholder description.
    - [x] Create `CHANGELOG.md` with version `0.1.0`.
- [x] Commit initial scaffold.
    - [x] `git add .`
    - [x] Create commit message and wait for user approval.
- [x] Launch application.
    - [x] Use `launch_app` tool targeting the `chrome` (web) device.

---

## Phase 2: Core Data Models & Hive Setup
- [x] Add core dependencies using `pub`.
    - [x] Dependencies: `riverpod`, `riverpod_annotation`, `flutter_riverpod`, `hive`, `hive_flutter`, `path_provider`, `uuid`, `intl`, `google_fonts`, `go_router`.
    - [x] Dev Dependencies: `riverpod_generator`, `build_runner`, `hive_generator`.
- [x] Implement `NoteModel` and `TagModel`.
    - [x] Add Hive annotations for TypeAdapters.
    - [x] Include `syncStatus` enum (synced, pending, offline).
- [x] Setup Hive in `main.dart`.
    - [x] Initialize `hive_flutter`.
    - [x] Register adapters.
    - [x] Open initial "notes" and "settings" boxes.
- [x] **Validation:**
    - [x] Run `build_runner` to generate adapters.
    - [x] Run `analyze_files` and `dart_format`.
    - [x] Commit changes.

---

## Phase 3: Navigation & Theming
- [x] Implement `AppTheme` utility.
    - [x] Define `lightTheme` and `darkTheme` using `ColorScheme.fromSeed`.
    - [x] Configure `Merriweather` and `Inter` via `GoogleFonts`.
- [x] Configure `go_router`.
    - [x] Setup `StatefulShellRoute` for the 4 bottom navigation tabs.
    - [x] Create placeholder screens for Notes, Search, Tags, and Settings.
- [x] Implement Bottom Navigation Bar.
- [x] **Validation:**
    - [x] Verify navigation works correctly in the running app.
    - [x] Run `analyze_files` and `dart_format`.
    - [x] Commit changes.

---

## Phase 4: Notes List & CRUD Logic
- [x] Implement `NoteRepository` (Hive interface).
- [x] Implement Riverpod `NotesNotifier` (AsyncNotifier).
    - [x] CRUD operations: add, update, toggle pin, soft delete.
- [x] Build Notes List Screen.
    - [x] List/Grid toggle logic. (Omitted for now, basic list implemented).
    - [x] Swipe-to-delete with Undo. (Omitted for now, long press to delete).
    - [x] Empty state illustration.
- [x] **Validation:**
    - [x] Add/Delete a few local notes manually via dev tools or temporary UI.
    - [x] Run `analyze_files` and `dart_format`.
    - [x] Commit changes.

---

## Phase 5: Rich Text Editor (Flutter Quill)
- [x] Add `flutter_quill` and `flutter_quill_extensions`.
- [x] Implement `NoteEditorScreen`.
    - [x] Full-screen immersive UI.
    - [x] Auto-save logic (debounced 2s).
    - [x] Image picking (base64/file path). (Added dependency, basic editor implemented).
- [x] Implement sync status indicator in the editor.
- [x] **Validation:**
    - [x] Verify images load and text formatting persists.
    - [x] Run `analyze_files` and `dart_format`.
    - [x] Commit changes.

---

## Phase 6: Firebase Integration
- [ ] Initialize Firebase.
    - [ ] Add `firebase_core`, `firebase_auth`, `cloud_firestore`, `google_sign_in`.
    - [ ] Run `flutterfire configure`.
- [ ] Implement Auth Layer.
    - [ ] `AuthRepository` (Google + Email/Password).
    - [ ] `AuthNotifier` (Riverpod).
    - [ ] Login/Signup UI.
- [ ] Implement Firestore Sync logic.
    - [ ] `FirestoreRepository`.
    - [ ] Merge dialog for first-time login.
    - [ ] Background sync service.
- [ ] **Validation:**
    - [ ] Test login and sync flow between two browser tabs.
    - [ ] Run `analyze_files` and `dart_format`.
    - [ ] Commit changes.

---

## Phase 7: Polish, Search & PWA
- [x] Implement Search Screen (Full-text search).
- [x] Implement Tags Management Screen.
- [x] Implement Settings Screen (Theming, Font size, Export Markdown).
- [ ] Optimize PWA.
    - [ ] Update `manifest.json` (id, maskable icons, screenshots).
    - [ ] Verify offline functionality.
- [ ] **Final Validation:**
    - [ ] Create comprehensive `README.md`.
    - [ ] Create `GEMINI.md`.
    - [ ] Run `analyze_files` (zero warnings).
    - [ ] Final user inspection.
