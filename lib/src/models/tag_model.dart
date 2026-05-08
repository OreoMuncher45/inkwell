import 'package:hive_ce/hive.dart';

part 'tag_model.g.dart';

@HiveType(typeId: 2)
class TagModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final int noteCount;

  TagModel({required this.id, required this.name, this.noteCount = 0});

  TagModel copyWith({String? id, String? name, int? noteCount}) {
    return TagModel(
      id: id ?? this.id,
      name: name ?? this.name,
      noteCount: noteCount ?? this.noteCount,
    );
  }
}
