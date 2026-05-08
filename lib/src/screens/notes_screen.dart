import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:uuid/uuid.dart';
import '../providers/note_providers.dart';
import '../models/note_model.dart';

class NotesScreen extends ConsumerWidget {
  const NotesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notesAsync = ref.watch(notesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Inkwell'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _createNewNote(context, ref),
          ),
        ],
      ),
      body: notesAsync.when(
        data: (notes) {
          if (notes.isEmpty) {
            return const Center(child: Text('No notes yet. Tap + to start.'));
          }
          return ListView.builder(
            itemCount: notes.length,
            itemBuilder: (context, index) {
              final note = notes[index];
              return ListTile(
                title: Text(note.title),
                subtitle: Text(
                  note.plainText,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                onTap: () => context.push('/notes/editor/${note.id}'),
                trailing: IconButton(
                  icon: Icon(
                    note.isPinned ? Icons.push_pin : Icons.push_pin_outlined,
                  ),
                  onPressed: () =>
                      ref.read(notesProvider.notifier).togglePin(note.id),
                ),
                onLongPress: () =>
                    ref.read(notesProvider.notifier).softDelete(note.id),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _createNewNote(context, ref),
        child: const Icon(Icons.edit),
      ),
    );
  }

  void _createNewNote(BuildContext context, WidgetRef ref) async {
    final id = const Uuid().v4();
    final note = NoteModel(
      id: id,
      userId: 'test_user',
      title: 'New Note',
      contentJson: '[{"insert":"\\n"}]', // Valid empty Quill document
      plainText: '',
      tags: [],
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
    await ref.read(notesProvider.notifier).addNote(note);
    if (context.mounted) {
      context.push('/notes/editor/$id');
    }
  }
}
