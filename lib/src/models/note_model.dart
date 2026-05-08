import 'package:hive_ce/hive.dart';

part 'note_model.g.dart';

@HiveType(typeId: 0)
enum SyncStatus {
  @HiveField(0)
  synced,
  @HiveField(1)
  pending,
  @HiveField(2)
  offline,
}

@HiveType(typeId: 1)
class NoteModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String userId;

  @HiveField(2)
  final String title;

  @HiveField(3)
  final String contentJson;

  @HiveField(4)
  final String plainText;

  @HiveField(5)
  final List<String> tags;

  @HiveField(6)
  final DateTime createdAt;

  @HiveField(7)
  final DateTime updatedAt;

  @HiveField(8)
  final bool isPinned;

  @HiveField(9)
  final bool isDeleted;

  @HiveField(10)
  final SyncStatus syncStatus;

  NoteModel({
    required this.id,
    required this.userId,
    required this.title,
    required this.contentJson,
    required this.plainText,
    required this.tags,
    required this.createdAt,
    required this.updatedAt,
    this.isPinned = false,
    this.isDeleted = false,
    this.syncStatus = SyncStatus.offline,
  });

  NoteModel copyWith({
    String? id,
    String? userId,
    String? title,
    String? contentJson,
    String? plainText,
    List<String>? tags,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isPinned,
    bool? isDeleted,
    SyncStatus? syncStatus,
  }) {
    return NoteModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      contentJson: contentJson ?? this.contentJson,
      plainText: plainText ?? this.plainText,
      tags: tags ?? this.tags,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isPinned: isPinned ?? this.isPinned,
      isDeleted: isDeleted ?? this.isDeleted,
      syncStatus: syncStatus ?? this.syncStatus,
    );
  }
}
