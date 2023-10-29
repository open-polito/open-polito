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

CourseFileInfo? fileFromAPI(api.CourseDirectoryContent res, int courseId) =>
    switch (res) {
      api.CourseDirectory() => null,
      api.CourseFileOverview() => CourseFileInfo(
          id: res.id,
          name: res.name,
          sizeKB: res.sizeInKiloBytes,
          mimeType: res.mimeType,
          createdAt: res.createdAt,
        ),
    };
