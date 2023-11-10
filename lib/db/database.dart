import 'dart:io';

import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:open_polito/db/daos/courses_dao.dart';
import 'package:open_polito/db/schema/schema.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';

part 'database.g.dart';

@DriftDatabase(tables: [
  CourseOverviews,
  CoursePreviousEditions,
  CourseNotices,
  CourseDirItems,
  DownloadItems
], daos: [
  CoursesDao,
])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    // TODO: change. For example, this is ~/Documents on Linux.
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(join(dbFolder.path, "db.sqlite"));
    return NativeDatabase.createInBackground(file);
  });
}
