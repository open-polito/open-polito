import 'package:drift/drift.dart';
import 'package:open_polito/db/database.dart';
import 'package:open_polito/db/schema/schema.dart';
import 'package:open_polito/models/models.dart';

part 'courses_dao.g.dart';

@DriftAccessor(tables: [DbCourses, DbCourseDirItems, DbCourseRecordedClasses])
class CoursesDao extends DatabaseAccessor<AppDatabase> with _$CoursesDaoMixin {
  CoursesDao(super.db);

  /// Get course overviews
  Future<Iterable<DbCourse>> getCourses() {
    return select(dbCourses).get();
  }

  /// Delete all courses
  Future<void> deleteCourses() async {
    await delete(dbCourses).go();
  }

  /// Sets courses.
  ///
  /// Deletes all courses not in [courseIds], to avoid stale data.
  Future<void> setCourses(
      Iterable<DbCoursesCompanion> items, List<int> courseIds) async {
    await transaction(() async {
      await batch((batch) {
        batch.insertAll(dbCourses, items, mode: InsertMode.replace);
      });
      // delete old data
      await (delete(dbCourses)..where((tbl) => tbl.courseId.isNotIn(courseIds)))
          .go();
    });
  }

  /// Add course material
  Future<void> addCourseMaterial(
      Iterable<DbCourseDirItemsCompanion> items) async {
    await batch((batch) {
      batch.insertAll(dbCourseDirItems, items);
    });
  }

  /// Get course material.
  ///
  /// If [filesOnly], only returns files. In this case, specify [sortBy]
  /// and/or [sortOrder] to override the default sorting key and default order.
  Future<Iterable<DbCourseDirItem>> getCourseMaterial({
    bool filesOnly = false,
    // TODO: enable
    SortBy sortBy = SortBy.createdAt,
    // TODO: enable
    SortOrder sortOrder = SortOrder.desc,
  }) {
    if (filesOnly) {
      return (select(dbCourseDirItems)
            ..where((tbl) => tbl.type.equalsValue(DbCourseDirItemType.file))
            ..orderBy([(tbl) => OrderingTerm.desc(tbl.createdAt)]))
          .get();
    }
    return select(dbCourseDirItems).get();
  }

  /// Get all recorded classes
  ///
  /// If [courseId] is not specified, returns all recorded classes
  /// from all courses.
  Future<Iterable<CourseRecordedClass>> getCourseRecordedClasses(
      {int? courseId}) {
    if (courseId != null) {
      return (select(dbCourseRecordedClasses)
            ..where((tbl) => tbl.courseId.equals(courseId)))
          .get();
    }
    return select(dbCourseRecordedClasses).get();
  }

  /// Set course recorded classes
  Future<void> addCourseRecordedClasses(
      Iterable<DbCourseRecordedClassesCompanion> classes) async {
    await batch((batch) {
      batch.insertAll(dbCourseRecordedClasses, classes);
    });
  }
}
