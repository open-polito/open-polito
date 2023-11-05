import 'package:open_polito/data/local_data_source.dart';
import 'package:open_polito/models/courses.dart';

final demoState = LocalData(coursesById: {
  1: CourseData(
    files: [
      CourseFileInfo(
        id: "1",
        name: "Example file ex 1.pdf",
        sizeKB: 14374,
        mimeType: "application/pdf",
        createdAt: DateTime(2023, 10, 20, 12, 20, 54),
      ),
    ],
    overview: const CourseOverview(
        id: 1,
        name: "Course name goes here",
        code: "01abcde",
        cfu: 10,
        teachingPeriod: CourseTeachingPeriod(year: 2023, semester: 1),
        isOverbooking: false,
        isInPersonalStudyPlan: true,
        isModule: false),
    virtualClassrooms: [
      VirtualClassroom(
          courseId: 1,
          isLive: true,
          live: VirtualClassroomLive(
              title: "Live classroom",
              meetingId: "",
              createdAt: DateTime(2023, 10, 24, 14, 34))),
    ],
  ),
});
