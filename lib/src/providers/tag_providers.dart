import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:hive_ce/hive.dart';
import '../models/tag_model.dart';
import '../repositories/tag_repository.dart';

part 'tag_providers.g.dart';

@riverpod
TagRepository tagRepository(Ref ref) {
  // We need to open the tags box first if it's not opened in main.dart
  // Let's check main.dart. It only opened 'notes' and 'settings'.
  // I should add 'tags' to main.dart.
  final box = Hive.box<TagModel>('tags');
  return TagRepository(box);
}

@riverpod
class TagsNotifier extends _$TagsNotifier {
  @override
  FutureOr<List<TagModel>> build() {
    final repository = ref.watch(tagRepositoryProvider);
    return repository.getAllTags();
  }

  Future<void> addTag(String name) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final repository = ref.read(tagRepositoryProvider);
      final id = DateTime.now().millisecondsSinceEpoch.toString();
      await repository.addTag(TagModel(id: id, name: name));
      return repository.getAllTags();
    });
  }

  Future<void> deleteTag(String id) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final repository = ref.read(tagRepositoryProvider);
      await repository.deleteTag(id);
      return repository.getAllTags();
    });
  }
}
