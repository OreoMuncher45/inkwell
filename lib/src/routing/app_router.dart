import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../screens/notes_screen.dart';
import '../screens/search_screen.dart';
import '../screens/tags_screen.dart';
import '../screens/settings_screen.dart';
import '../screens/scaffold_with_nav_bar.dart';
import '../screens/note_editor_screen.dart';

final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>();
final GlobalKey<NavigatorState> _notesNavigatorKey =
    GlobalKey<NavigatorState>();
final GlobalKey<NavigatorState> _searchNavigatorKey =
    GlobalKey<NavigatorState>();
final GlobalKey<NavigatorState> _tagsNavigatorKey = GlobalKey<NavigatorState>();
final GlobalKey<NavigatorState> _settingsNavigatorKey =
    GlobalKey<NavigatorState>();

final GoRouter appRouter = GoRouter(
  initialLocation: '/notes',
  navigatorKey: _rootNavigatorKey,
  routes: [
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) {
        return ScaffoldWithNavBar(navigationShell: navigationShell);
      },
      branches: [
        StatefulShellBranch(
          navigatorKey: _notesNavigatorKey,
          routes: [
            GoRoute(
              path: '/notes',
              builder: (context, state) => const NotesScreen(),
              routes: [
                GoRoute(
                  path: 'editor/:id',
                  parentNavigatorKey: _rootNavigatorKey,
                  builder: (context, state) {
                    final id = state.pathParameters['id'];
                    return NoteEditorScreen(noteId: id);
                  },
                ),
              ],
            ),
          ],
        ),
        StatefulShellBranch(
          navigatorKey: _searchNavigatorKey,
          routes: [
            GoRoute(
              path: '/search',
              builder: (context, state) => const SearchScreen(),
            ),
          ],
        ),
        StatefulShellBranch(
          navigatorKey: _tagsNavigatorKey,
          routes: [
            GoRoute(
              path: '/tags',
              builder: (context, state) => const TagsScreen(),
            ),
          ],
        ),
        StatefulShellBranch(
          navigatorKey: _settingsNavigatorKey,
          routes: [
            GoRoute(
              path: '/settings',
              builder: (context, state) => const SettingsScreen(),
            ),
          ],
        ),
      ],
    ),
  ],
);
