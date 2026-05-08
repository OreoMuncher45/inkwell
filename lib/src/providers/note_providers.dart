import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:hive_ce/hive.dart';
import '../models/note_model.dart';
import '../repositories/note_repository.dart';

part 'note_providers.g.dart';

@riverpod
NoteRepository noteRepository(Ref ref) {
  final box = Hive.box<NoteModel>('notes');
  return NoteRepository(box);
}

@riverpod
class NotesNotifier extends _$NotesNotifier {
  @override
  FutureOr<List<NoteModel>> build() {
    return _getNotes();
  }

  List<NoteModel> _getNotes() {
    final repository = ref.read(noteRepositoryProvider);
    return repository.getAllNotes().where((n) => !n.isDeleted).toList()
      ..sort((a, b) => b.updatedAt.compareTo(a.updatedAt));
  }

  Future<void> addNote(NoteModel note) async {
    final repository = ref.read(noteRepositoryProvider);
    await repository.addNote(note);
    state = AsyncData(_getNotes());
  }

  Future<void> updateNote(NoteModel note) async {
    final repository = ref.read(noteRepositoryProvider);
    await repository.updateNote(note);
    state = AsyncData(_getNotes());
  }

  Future<void> togglePin(String id) async {
    final repository = ref.read(noteRepositoryProvider);
    final notes = repository.getAllNotes();
    final note = notes.firstWhere((n) => n.id == id);
    await repository.updateNote(note.copyWith(isPinned: !note.isPinned));
    state = AsyncData(_getNotes());
  }

  Future<void> softDelete(String id) async {
    final repository = ref.read(noteRepositoryProvider);
    final notes = repository.getAllNotes();
    final note = notes.firstWhere((n) => n.id == id);
    await repository.updateNote(note.copyWith(isDeleted: true));
    state = AsyncData(_getNotes());
  }
}
