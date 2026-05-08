import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/note_providers.dart';
import '../models/note_model.dart';
import '../utils/debouncer.dart';

class NoteEditorScreen extends ConsumerStatefulWidget {
  final String? noteId;

  const NoteEditorScreen({super.key, this.noteId});

  @override
  ConsumerState<NoteEditorScreen> createState() => _NoteEditorScreenState();
}

class _NoteEditorScreenState extends ConsumerState<NoteEditorScreen> {
  late TextEditingController _controller;
  NoteModel? _note;
  bool _isSaving = false;
  final _debouncer = Debouncer(milliseconds: 1000);

  @override
  void initState() {
    super.initState();
    _initializeEditor();
  }

  void _initializeEditor() {
    if (widget.noteId != null) {
      final repository = ref.read(noteRepositoryProvider);
      try {
        _note = repository.getAllNotes().firstWhere(
          (n) => n.id == widget.noteId,
        );
        _controller = TextEditingController(text: _note!.plainText);
      } catch (e) {
        _controller = TextEditingController();
      }
    } else {
      _controller = TextEditingController();
    }

    _controller.addListener(() {
      _debouncer.run(() => _autoSave());
    });
  }

  Future<void> _autoSave() async {
    if (!mounted || _note == null) return;

    setState(() {
      _isSaving = true;
    });

    try {
      final plainText = _controller.text;

      final updatedNote = _note!.copyWith(
        plainText: plainText,
        updatedAt: DateTime.now(),
      );

      await ref.read(noteRepositoryProvider).updateNote(updatedNote);
      _note = updatedNote;
    } catch (e) {
      debugPrint('Auto-save error: $e');
    } finally {
      if (mounted) {
        setState(() {
          _isSaving = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_note?.title ?? 'Note'),
        actions: [
          if (_isSaving)
            const Center(
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 16),
                child: SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2),
                ),
              ),
            ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: TextField(
            controller: _controller,
            maxLines: null,
            expands: true,
            decoration: const InputDecoration(
              hintText: 'Start typing...',
              border: InputBorder.none,
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _debouncer.dispose();
    _controller.dispose();
    super.dispose();
  }
}
