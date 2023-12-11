import 'package:open_polito/api/models/models.dart';
import 'package:open_polito/models/models.dart';
import 'package:path/path.dart';

CourseOverview courseOverviewFromAPI(ApiCourseOverview res) => CourseOverview(
      cfu: res.cfu,
      code: res.shortcode,
      id: res.id ?? 0,
      isInPersonalStudyPlan: res.isInPersonalStudyPlan,
      isModule: res.isModule,
      isOverbooking: res.isOverBooking,
      name: res.name,
      teachingPeriod: CourseTeachingPeriod.parse(res.teachingPeriod),
      moduleNumber: res.moduleNumber,
      year: res.year,
    );

CourseVirtualClassroom vcFromAPI(
        ApiVirtualClassroomBase res, int courseId, String courseName) =>
    switch (res) {
      ApiVirtualClassroom() => CourseVirtualClassroom(
          courseId: courseId,
          courseName: courseName,
          isLive: false,
          recording: res,
        ),
      ApiVirtualClassroomLive() => CourseVirtualClassroom(
          courseId: courseId,
          courseName: courseName,
          isLive: true,
          live: CourseVirtualClassroomLive(
            title: res.title,
            meetingId: res.meetingId,
            createdAt: res.createdAt,
          )),
    };

/// Convert directory item
CourseDirectoryItem fileFromAPI(
  ApiCourseDirectoryContent res,
  int courseId, {
  String? parentId,
  required String courseName,
  required String path,
}) =>
    switch (res) {
      ApiCourseDirectory() => CourseDirInfo(
          id: res.id,
          children: res.files.map((e) => e.id),
          name: res.name,
          parentId: parentId,
          courseId: courseId,
          courseName: courseName,
          path: join(path, res.name),
        ),
      ApiCourseFileOverview() => CourseFileInfo(
          id: res.id,
          name: res.name,
          sizeKB: BigInt.from(res.sizeInKiloBytes),
          mimeType: res.mimeType,
          createdAt: res.createdAt,
          parentId: parentId,
          courseId: courseId,
          courseName: courseName,
          path: join(path, res.name),
        ),
    };
