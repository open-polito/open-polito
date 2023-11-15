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
      batch.insertAll(dbCourseDirItems, items, mode: InsertMode.replace);
    });
  }

  /// Returns n latest files.
  Future<Iterable<(DbCourseDirItem, String)>> getLatestFiles() async {
    final query = select(dbCourseDirItems).join([
      innerJoin(
          dbCourses, dbCourses.courseId.equalsExp(dbCourseDirItems.courseId))
    ])
      ..where(dbCourseDirItems.type.equalsValue(DbCourseDirItemType.file))
      ..orderBy([OrderingTerm.desc(dbCourseDirItems.createdAt)])
      ..limit(10);
    final data = (await query.get()).map((e) => (
          e.readTable(dbCourseDirItems),
          e.readTable(dbCourses).name,
        ));

    return data;
  }

  // Returns n latest recorded classes
  Future<Iterable<(DbCourseRecordedClass, String)>>
      getLatestRecordedClasses() async {
    final query = select(dbCourseRecordedClasses).join([
      innerJoin(dbCourses,
          dbCourses.courseId.equalsExp(dbCourseRecordedClasses.courseId))
    ])
      ..orderBy([OrderingTerm.desc(dbCourseRecordedClasses.createdAt)])
      ..limit(10);
    final data = (await query.get()).map((e) => (
          e.readTable(dbCourseRecordedClasses),
          e.readTable(dbCourses).name,
        ));

    return data;
  }

  /// Returns the course name from id
  Future<String?> getCourseNameById(int id) async {
    return (await (select(dbCourseDirItems)
              ..where((tbl) => tbl.courseId.equals(id)))
            .getSingleOrNull())
        ?.name;
  }

  /// Get course material.
  ///
  /// If [filesOnly], only returns files. In this case, specify [sortBy]
  /// and/or [sortOrder] to override the default sorting key and default order.
  Future<Iterable<DbCourseDirItem>> getCourseMaterial({
    int? courseId,

    /// Return only children of this directory id
    String? parentId,
    bool filesOnly = false,
    // TODO: enable
    SortBy sortBy = SortBy.createdAt,
    // TODO: enable
    SortOrder sortOrder = SortOrder.desc,
    bool paginated = false,
    int pageIndex = 0,
    int? maxResults,
  }) {
    const elementsPerPage = 5;
    final query = select(dbCourseDirItems)
      ..where((tbl) => Expression.and([
            if (filesOnly) tbl.type.equalsValue(DbCourseDirItemType.file),
            if (courseId != null) tbl.courseId.equals(courseId),
            if (parentId != null) tbl.parentId.equals(parentId),
          ]))
      ..orderBy([(tbl) => OrderingTerm.desc(tbl.createdAt)]);

    if (paginated) {
      query.limit(elementsPerPage, offset: elementsPerPage * pageIndex);
    } else if (maxResults != null) {
      query.limit(maxResults);
    }

    return query.get();
  }

  /// Get all recorded classes
  ///
  /// If [courseId] is not specified, returns all recorded classes
  /// from all courses.
  Future<Iterable<DbCourseRecordedClass>> getCourseRecordedClasses(
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
      batch.insertAll(dbCourseRecordedClasses, classes,
          mode: InsertMode.replace);
    });
  }

  Future<Iterable<DbCourseDirItem>> searchFiles(
    String q, {
    required SearchCategory category,
    required SortBy sortBy,
    required SortOrder sortOrder,
  }) async {
    final orderingTerm = switch (sortOrder) {
      SortOrder.asc => OrderingTerm.asc,
      SortOrder.desc => OrderingTerm.desc,
    };
    final sortByCol = switch (sortBy) {
      SortBy.name => dbCourseDirItems.name,
      SortBy.size => dbCourseDirItems.sizeKB,
      SortBy.createdAt => dbCourseDirItems.createdAt,
    };
    final query = select(dbCourseDirItems)
      ..where((tbl) => tbl.name.like(q))
      ..orderBy([
        (_) => orderingTerm(sortByCol),
      ]);
    return await query.get();
  }

  Future<Iterable<DbCourseRecordedClass>> searchVideos(
    String q, {
    required SearchCategory category,
    required SortBy sortBy,
    required SortOrder sortOrder,
  }) async {
    final orderingTerm = switch (sortOrder) {
      SortOrder.asc => OrderingTerm.asc,
      SortOrder.desc => OrderingTerm.desc,
    };
    final sortByCol = switch (sortBy) {
      SortBy.name => dbCourseRecordedClasses.title,
      SortBy.size => null,
      SortBy.createdAt => dbCourseRecordedClasses.createdAt,
    };
    final query = select(dbCourseRecordedClasses)
      ..where((tbl) => tbl.title.like(q))
      ..orderBy([
        if (sortByCol != null) (_) => orderingTerm(sortByCol),
      ]);
    return await query.get();
  }
}
