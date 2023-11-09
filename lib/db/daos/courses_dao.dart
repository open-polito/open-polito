import 'package:drift/drift.dart';
import 'package:open_polito/db/database.dart';
import 'package:open_polito/db/schema/schema.dart';
import 'package:open_polito/models/utils.dart';

part 'courses_dao.g.dart';

@DriftAccessor(tables: [CourseOverviews, CourseDirItems])
class CoursesDao extends DatabaseAccessor<AppDatabase> with _$CoursesDaoMixin {
  CoursesDao(super.db);

  /// Get course overviews
  Future<Iterable<CourseOverview>> getCourses() {
    return select(courseOverviews).get();
  }

  /// Delete all courses
  Future<void> deleteCourses() async {
    await delete(courseOverviews).go();
  }

  /// Add courses
  Future<void> addCourses(Iterable<CourseOverviewsCompanion> courses) async {
    await batch((batch) {
      batch.insertAll(courseOverviews, courses);
    });
  }

  /// Add course material
  Future<void> addCourseMaterial(
      Iterable<CourseDirItemsCompanion> items) async {
    await batch((batch) {
      batch.insertAll(courseDirItems, items);
    });
  }

  /// Get course material.
  ///
  /// If [filesOnly], only returns files. In this case, specify [sortBy]
  /// and/or [sortOrder] to override the default sorting key and default order.
  Future<Iterable<CourseDirItem>> getCourseMaterial({
    bool filesOnly = false,
    // TODO: enable
    SortBy sortBy = SortBy.createdAt,
    // TODO: enable
    SortOrder sortOrder = SortOrder.desc,
  }) {
    if (filesOnly) {
      return (select(courseDirItems)
            ..where((tbl) => tbl.type.equalsValue(CourseDirItemType.file))
            ..orderBy([(tbl) => OrderingTerm.desc(tbl.createdAt)]))
          .get();
    }
    return select(courseDirItems).get();
  }

  /// Delete all course material from course with id matching [courseId].
  Future<void> deleteCourseMaterial({required int courseId}) async {
    await (delete(courseDirItems)
          ..where((tbl) => tbl.courseId.equals(courseId)))
        .go();
  }

  /// Delete all course material not belonging to the courses in [courseIds].
  Future<void> deleteCourseMaterialNotInIds(
      {required Iterable<int> courseIds}) async {
    await (delete(courseDirItems)
          ..where((tbl) => tbl.courseId.isNotIn(courseIds)))
        .go();
  }
}
