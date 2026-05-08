import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/note_model.dart';
import 'note_providers.dart';

part 'search_providers.g.dart';

@riverpod
class SearchQuery extends _$SearchQuery {
  @override
  String build() => '';

  void update(String query) => state = query;
}

@riverpod
Future<List<NoteModel>> searchResults(Ref ref) async {
  final query = ref.watch(searchQueryProvider).toLowerCase();
  final notesAsync = ref.watch(notesProvider);

  return notesAsync.when(
    data: (notes) {
      if (query.isEmpty) return [];
      return notes.where((note) {
        return note.title.toLowerCase().contains(query) ||
            note.plainText.toLowerCase().contains(query);
      }).toList();
    },
    loading: () => [],
    error: (err, stack) => [],
  );
}
