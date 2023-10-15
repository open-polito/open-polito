import 'package:dio/dio.dart' hide Headers;
import 'package:open_polito/api/models/auth.dart';
import 'package:open_polito/api/models/courses.dart';
import 'package:retrofit/retrofit.dart';

part 'api_client.g.dart';

typedef Res<T> = HttpResponse<T>;

const jsonHeaders = <String, dynamic>{
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

@RestApi(baseUrl: "https://app.didattica.polito.it/api")
abstract class ApiClient {
  factory ApiClient(Dio dio, {String baseUrl}) = _ApiClient;

  @POST("/auth/login")
  @Headers(jsonHeaders)
  Future<Res<Login200Response>> login(@Body() LoginRequest req);

  @DELETE("/auth/logout")
  Future<void> logout();

  @GET("/courses")
  Future<Res<GetCourses200Response>> getCourses();

  @GET("/courses/{courseId}/virtual-classrooms")
  Future<Res<GetCourseVirtualClassrooms200Response>> getCourseVirtualClassrooms(
    @Path() int courseId, {
    @Query("live") bool? live,
  });
}
