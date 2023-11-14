import 'package:drift/drift.dart';

enum DbCourseDirItemType {
  /// Directory
  dir,

  /// File
  file,
}

enum DbCourseClassType {
  /// Standard class type
  virtualClassroom,

  /// Legacy class type
  videoLecture,
}

class DbCourses extends Table {
  @override
  String? get tableName => "courses";

  IntColumn get id => integer().autoIncrement()();
  IntColumn get courseId => integer().unique()();

  TextColumn get name => text()();
  TextColumn get code => text()();
  IntColumn get cfu => integer()();
  IntColumn get semester => integer().nullable()();
  BoolColumn get isOverBooking => boolean()();
  BoolColumn get isInPersonalStudyPlan => boolean()();
  BoolColumn get isModule => boolean()();
  IntColumn get moduleNumber => integer().nullable()();
  TextColumn get year => text().nullable()();
  IntColumn get teacherId => integer().nullable()();
}

class DbCoursePreviousEditions extends Table {
  @override
  String? get tableName => "course_previous_editions";

  IntColumn get id => integer().autoIncrement()();
  IntColumn get editionId => integer().unique()();

  TextColumn get year => text()();

  IntColumn get courseId => integer().customConstraint(
      "NOT NULL REFERENCES courses (course_id) ON DELETE CASCADE")();
}

class DbCourseNotices extends Table {
  @override
  String? get tableName => "course_notices";

  IntColumn get id => integer().autoIncrement()();
  IntColumn get noticeId => integer().unique()();

  DateTimeColumn get publishedAt => dateTime()();
  DateTimeColumn get expiresAt => dateTime()();
  TextColumn get content => text()();

  IntColumn get courseId => integer().customConstraint(
      "NOT NULL REFERENCES courses (course_id) ON DELETE CASCADE")();
}

class DbCourseDirItems extends Table {
  @override
  String? get tableName => "course_dir_items";

  IntColumn get id => integer().autoIncrement()();
  TextColumn get itemId => text().unique()();

  TextColumn get type => textEnum<DbCourseDirItemType>()();
  TextColumn get name => text()();

  // exclusively used for file
  Int64Column get sizeKB => int64().nullable()();
  TextColumn get mimeType => text().nullable()();
  DateTimeColumn get createdAt => dateTime().nullable()();

  IntColumn get courseId => integer().customConstraint(
      "NOT NULL REFERENCES courses (course_id) ON DELETE CASCADE")();

  /// Parent directory id.
  /// `null` if in root directory.
  TextColumn get parentId =>
      text().references(DbCourseDirItems, #itemId).nullable()();
}

@DataClassName("DbCourseRecordedClass")
class DbCourseRecordedClasses extends Table {
  @override
  String? get tableName => "course_recorded_classes";

  IntColumn get id => integer().autoIncrement()();
  IntColumn get classId => integer()();

  @override
  List<Set<Column<Object>>>? get uniqueKeys => [
        {classId, type}
      ];

  TextColumn get type => textEnum<DbCourseClassType>()();
  TextColumn get title => text().nullable()();
  IntColumn get teacherId => integer().nullable()();
  TextColumn get abstract => text().nullable()();
  TextColumn get coverUrl => text().nullable()();
  TextColumn get videoUrl => text().nullable()();
  TextColumn get audioUrl => text().nullable()();
  DateTimeColumn get createdAt => dateTime().nullable()();
  TextColumn get durationStr => text().nullable()();

  IntColumn get courseId => integer().customConstraint(
      "NOT NULL REFERENCES courses (course_id) ON DELETE CASCADE")();
}
