import 'package:open_polito/api/models/courses.dart' as api;
import 'package:open_polito/models/courses.dart';

CourseOverview courseOverviewFromAPI(api.CourseOverview res) => CourseOverview(
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

VirtualClassroom vcFromAPI(api.VirtualClassroomBase res, int courseId) =>
    switch (res) {
      api.VirtualClassroom() =>
        VirtualClassroom(courseId: courseId, isLive: false),
      api.VirtualClassroomLive() => VirtualClassroom(
          courseId: courseId,
          isLive: true,
          live: VirtualClassroomLive(
            title: res.title,
            meetingId: res.meetingId,
            createdAt: res.createdAt,
          )),
    };

/// Convert directory item
CourseDirectoryItem fileFromAPI(api.CourseDirectoryContent res, int courseId,
        {String? parentId}) =>
    switch (res) {
      api.CourseDirectory() => CourseDirInfo(
          id: res.id,
          children: res.files.map((e) => e.id),
          name: res.name,
          parentId: parentId,
        ),
      api.CourseFileOverview() => CourseFileInfo(
          id: res.id,
          name: res.name,
          sizeKB: BigInt.from(res.sizeInKiloBytes),
          mimeType: res.mimeType,
          createdAt: res.createdAt,
          parentId: parentId,
        ),
    };

/// Convert API's directory tree into map structure.
Map<String, CourseDirectoryItem> dirMapFromAPI(
  Iterable<api.CourseDirectoryContent> res,
  int courseId, {
  String? parentId,
}) {
  final map = <String, CourseDirectoryItem>{};

  for (final item in res) {
    final converted = fileFromAPI(item, courseId, parentId: parentId);
    map[converted.id] = converted;

    if (item case api.CourseDirectory()) {
      map.addAll(dirMapFromAPI(item.files, courseId, parentId: item.id));
    }
  }

  return map;
}
