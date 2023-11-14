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
  return DbCoursesCompanion.insert(
    cfu: c.cfu,
    code: c.code,
    courseId: c.id,
    isInPersonalStudyPlan: c.isInPersonalStudyPlan,
    isModule: c.isModule,
    isOverBooking: c.isOverbooking,
    name: c.name,
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
    CourseFileInfo() => DbCourseDirItemsCompanion.insert(
        courseId: courseId,
        createdAt: Value(item.createdAt),
        itemId: item.id,
        mimeType: Value(item.mimeType),
        name: item.name,
        parentId: Value(item.parentId),
        sizeKB: Value(item.sizeKB),
        type: DbCourseDirItemType.file,
      ),
    CourseDirInfo() => DbCourseDirItemsCompanion.insert(
        courseId: courseId,
        itemId: item.id,
        name: item.name,
        parentId: Value(item.parentId),
        type: DbCourseDirItemType.dir,
      ),
  };
}

CourseVirtualClassroom vcFromDB(
  DbCourseRecordedClass item, {
  required String courseName,
}) {
  return CourseVirtualClassroom(
      courseId: item.courseId,
      courseName: courseName,
      isLive: false, // stored classes are never live!
      recording: ApiVirtualClassroom(
        id: item.classId,
        title: item.title,
        coverUrl: item.coverUrl,
        videoUrl: item.videoUrl,
        createdAt: item.createdAt,
        duration: item.durationStr,
        type:
            ApiVirtualClassroomType.recording, // stored classes are never live!
      ));
}

DbCourseRecordedClassesCompanion? dbCourseRecordedClass(
    CourseVirtualClassroom item, int courseId) {
  final vc = item.recording;
  // Do not process live classes or null items
  if (vc?.type == ApiVirtualClassroomType.live || vc == null) {
    return null;
  }
  return DbCourseRecordedClassesCompanion.insert(
    classId: vc.id,
    courseId: courseId,
    coverUrl: Value(vc.coverUrl),
    createdAt: Value(vc.createdAt),
    durationStr: Value(vc.duration),
    teacherId: Value(vc.teacherId),
    title: Value(vc.title),
    type: DbCourseClassType.virtualClassroom, // This is a virtual classroom
    videoUrl: Value(vc.videoUrl),
  );
}

Iterable<DbCourseDirItemsCompanion> dbCourseDirItemsFromAPI(
  Iterable<ApiCourseDirectoryContent> items, {
  required int courseId,

  /// if null, items are in root directory
  String? parentId,
}) {
  final list = <DbCourseDirItemsCompanion>[];
  final thisLevelItems = items.map((e) {
    return switch (e) {
      ApiCourseDirectory() => DbCourseDirItemsCompanion.insert(
          itemId: e.id,
          type: DbCourseDirItemType.dir,
          name: e.name,
          courseId: courseId,
        ),
      ApiCourseFileOverview() => DbCourseDirItemsCompanion.insert(
          itemId: e.id,
          type: DbCourseDirItemType.file,
          name: e.name,
          courseId: courseId,
          createdAt: Value(e.createdAt),
          mimeType: Value(e.mimeType),
          parentId: Value(parentId),
          sizeKB: Value(BigInt.from(e.sizeInKiloBytes)),
        ),
    };
  });

  list.addAll(thisLevelItems);

  for (final originalItem in items) {
    if (originalItem case ApiCourseDirectory()) {
      final children = originalItem.files;
      list.addAll(dbCourseDirItemsFromAPI(children,
          courseId: courseId, parentId: originalItem.id));
    }
  }

  return list;
}
