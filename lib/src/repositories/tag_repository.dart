import 'package:hive_ce/hive.dart';
import '../models/tag_model.dart';

class TagRepository {
  final Box<TagModel> _tagsBox;

  TagRepository(this._tagsBox);

  List<TagModel> getAllTags() {
    return _tagsBox.values.toList();
  }

  Future<void> addTag(TagModel tag) async {
    await _tagsBox.put(tag.id, tag);
  }

  Future<void> updateTag(TagModel tag) async {
    await _tagsBox.put(tag.id, tag);
  }

  Future<void> deleteTag(String id) async {
    await _tagsBox.delete(id);
  }
}
