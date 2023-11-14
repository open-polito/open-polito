import 'package:drift/drift.dart';
import 'package:open_polito/api/models/models.dart';
import 'package:open_polito/db/database.dart';
import 'package:open_polito/db/schema/schema.dart';
import 'package:open_polito/models/models.dart';

CourseOverview courseOverviewFromDB(DbCourse c) {
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

DbCoursesCompanion dbCourseOverview(CourseOverview c) {
  return DbCoursesCompanion(
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
    DbCourseDirItem item, Iterable<DbCourseDirItem> allItems,
    {required String courseName}) {
  final type = item.type;
  switch (type) {
    case DbCourseDirItemType.file:
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
          courseId: item.courseId,
          courseName: courseName,
        );
      }
      break;
    case DbCourseDirItemType.dir:
      return CourseDirectoryItem.dir(
        id: item.itemId,
        name: item.name,
        children: allItems
            .where((element) => element.parentId == item.itemId)
            .map((e) => e.itemId),
        parentId: item.parentId,
        courseId: item.courseId,
        courseName: courseName,
      );
    default:
      return null;
  }
  return null;
}

DbCourseDirItemsCompanion dbCourseDirItem(
    CourseDirectoryItem item, int courseId) {
  return switch (item) {
    CourseFileInfo() => DbCourseDirItemsCompanion(
        courseId: Value(courseId),
        createdAt: Value(item.createdAt),
        itemId: Value(item.id),
        mimeType: Value(item.mimeType),
        name: Value(item.name),
        parentId: Value(item.parentId),
        sizeKB: Value(item.sizeKB),
        type: const Value(DbCourseDirItemType.file),
      ),
    CourseDirInfo() => DbCourseDirItemsCompanion(
        courseId: Value(courseId),
        itemId: Value(item.id),
        name: Value(item.name),
        parentId: Value(item.parentId),
        type: const Value(DbCourseDirItemType.dir),
      ),
  };
}

DbCourseRecordedClassesCompanion? dbCourseRecordedClass(
    CourseVirtualClassroom item, int courseId) {
  final vc = item.recording;
  // Do not process live classes or null items
  if (vc?.type == ApiVirtualClassroomType.live || vc == null) {
    return null;
  }
  return DbCourseRecordedClassesCompanion(
    classId: Value(vc.id),
    courseId: Value(courseId),
    coverUrl: Value(vc.coverUrl),
    createdAt: Value(vc.createdAt),
    durationStr: Value(vc.duration),
    teacherId: Value(vc.teacherId),
    title: Value(vc.title),
    type: const Value(
        DbCourseClassType.virtualClassroom), // This is a virtual classroom
    videoUrl: Value(vc.videoUrl),
  );
}
