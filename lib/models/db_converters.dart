import 'package:drift/drift.dart';
import 'package:open_polito/db/database.dart' as db;
import 'package:open_polito/db/schema/schema.dart' as schema;
import 'package:open_polito/models/courses.dart';

CourseOverview courseOverviewFromDB(db.CourseOverview c) {
  return CourseOverview(
    id: c.courseId,
    name: c.name,
    code: c.code,
    cfu: c.cfu,
    teachingPeriod: CourseTeachingPeriod(
      year: int.tryParse(c.year ?? ""),
      semester: c.semester,
    ),
    isOverbooking: c.isOverBooking,
    isInPersonalStudyPlan: c.isInPersonalStudyPlan,
    isModule: c.isModule,
  );
}

db.CourseOverviewsCompanion dbCourseOverview(CourseOverview c) {
  return db.CourseOverviewsCompanion(
    cfu: Value(c.cfu),
    code: Value(c.code),
    courseId: Value(c.id),
    isInPersonalStudyPlan: Value(c.isInPersonalStudyPlan),
    isModule: Value(c.isModule),
    isOverBooking: Value(c.isOverbooking),
    name: Value(c.name),
    moduleNumber: Value(c.moduleNumber),
    semester: Value(c.teachingPeriod?.semester),
    teacherId: Value(c.teacherId),
    year: Value(c.year),
  );
}

CourseDirectoryItem? courseDirectoryItemFromDB(
    db.CourseDirItem item, Iterable<db.CourseDirItem> allItems) {
  final type = item.type;
  switch (type) {
    case schema.CourseDirItemType.file:
      final sizeKB = item.sizeKB;
      final mimeType = item.mimeType;
      final createdAt = item.createdAt;
      if (sizeKB != null && mimeType != null && createdAt != null) {
        return CourseDirectoryItem.file(
          id: item.itemId,
          name: item.name,
          sizeKB: sizeKB,
          mimeType: mimeType,
          createdAt: createdAt,
          parentId: item.parentId,
        );
      }
      break;
    case schema.CourseDirItemType.dir:
      return CourseDirectoryItem.dir(
        id: item.itemId,
        name: item.name,
        children: allItems
            .where((element) => element.parentId == item.itemId)
            .map((e) => e.itemId),
        parentId: item.parentId,
      );
    default:
      return null;
  }
  return null;
}