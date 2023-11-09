import 'package:drift/drift.dart';

enum CourseDirItemType {
  /// Directory
  dir,

  /// File
  file,
}

class CourseOverviews extends Table {
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

class CoursePreviousEditions extends Table {
  IntColumn get id => integer().autoIncrement()();
  IntColumn get editionId => integer().unique()();

  TextColumn get year => text()();

  IntColumn get parentId => integer().references(CourseOverviews, #courseId)();
}

class CourseNotices extends Table {
  IntColumn get id => integer().autoIncrement()();
  IntColumn get noticeId => integer().unique()();

  DateTimeColumn get publishedAt => dateTime()();
  DateTimeColumn get expiresAt => dateTime()();
  TextColumn get content => text()();

  IntColumn get courseId => integer().references(CourseOverviews, #courseId)();
}

class CourseDirItems extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get itemId => text()();

  TextColumn get type => textEnum<CourseDirItemType>()();
  TextColumn get name => text()();

  // exclusively used for file
  Int64Column get sizeKB => int64().nullable()();
  TextColumn get mimeType => text().nullable()();
  DateTimeColumn get createdAt => dateTime().nullable()();

  IntColumn get courseId => integer().references(CourseOverviews, #courseId)();

  /// Parent directory id.
  /// `null` if in root directory.
  TextColumn get parentId =>
      text().references(CourseDirItems, #itemId).nullable()();
}
