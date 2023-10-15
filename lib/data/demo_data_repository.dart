import 'package:open_polito/data/data_repository.dart';
import 'package:polito_api/polito_api.dart';

class DemoDataRepository extends IDataRepository {
  @override
  Future<GetCourseVirtualClassrooms200Response> getCourseVirtualClassrooms(
          {required int courseId}) =>
      Future.value(GetCourseVirtualClassrooms200ResponseBuilder()
        ..data =
            (GetCourseVirtualClassrooms200ResponseDataInnerBuilder().build()));

  @override
  Future<GetCourses200Response> getCourses() =>
      Future.value(const GetCourses200Response(data: [
        CourseOverview(
          id: 1,
          name: "Algebra lineare e geometria",
          shortcode: "01ABCD",
          cfu: 10,
          teachingPeriod: "1-2",
          teacherId: 1,
          previousEditions: [],
          isOverBooking: true,
          isInPersonalStudyPlan: true,
          isModule: false,
        ),
        CourseOverview(
          id: 2,
          name: "Operating systems",
          shortcode: "02BCDE",
          cfu: 6,
          teachingPeriod: "3-1",
          teacherId: 2,
          previousEditions: [
            PreviousCourseEdition(year: "2020", id: 3),
          ],
          isOverBooking: false,
          isInPersonalStudyPlan: true,
          isModule: false,
        ),
        CourseOverview(
          id: 1,
          name: "Computer networks",
          shortcode: "03CDEF",
          cfu: 8,
          teachingPeriod: "3-1",
          teacherId: 3,
          previousEditions: [],
          isOverBooking: false,
          isInPersonalStudyPlan: true,
          isModule: false,
        ),
      ]));
}
