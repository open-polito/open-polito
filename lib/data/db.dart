import 'dart:io';

import 'package:drift/native.dart';
import 'package:drift/drift.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';

part 'db.g.dart';

class Courses extends Table {
  IntColumn get id => integer().autoIncrement()();

  IntColumn get courseId => integer()();
  TextColumn get code => text()();
  IntColumn get cfu => integer()();
  TextColumn get teachingPeriod => text()();
}

@DriftDatabase(tables: [Courses])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;
}

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(join(dbFolder.path, "db.sqlite"));
    return NativeDatabase.createInBackground(file);
  });
}
