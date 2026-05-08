import 'package:hive_ce/hive.dart';
import '../models/note_model.dart';

class NoteRepository {
  final Box<NoteModel> _notesBox;

  NoteRepository(this._notesBox);

  List<NoteModel> getAllNotes() {
    return _notesBox.values.toList();
  }

  Future<void> addNote(NoteModel note) async {
    await _notesBox.put(note.id, note);
  }

  Future<void> updateNote(NoteModel note) async {
    await _notesBox.put(note.id, note);
  }

  Future<void> deleteNote(String id) async {
    await _notesBox.delete(id);
  }

  Stream<BoxEvent> watchNotes() {
    return _notesBox.watch();
  }
}
