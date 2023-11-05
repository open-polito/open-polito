import 'package:dio/dio.dart' hide Headers;
import 'package:open_polito/api/models/auth.dart';
import 'package:open_polito/api/models/courses.dart';
import 'package:open_polito/api/models/people.dart';
import 'package:retrofit/retrofit.dart';

part 'api_client.g.dart';

typedef Res<T> = HttpResponse<T>;

const jsonTypeHeader = {
  'Content-Type': 'application/json',
};
const jsonAcceptHeader = {
  'Accept': 'application/json',
};
const postHeaders = <String, dynamic>{
  ...jsonTypeHeader,
  ...jsonAcceptHeader,
};
const getHeaders = <String, dynamic>{
  ...jsonAcceptHeader,
};

@RestApi(baseUrl: "https://app.didattica.polito.it/api")
abstract class ApiClient {
  factory ApiClient(Dio dio, {String baseUrl}) = _ApiClient;

  @POST("/auth/login")
  @Headers(postHeaders)
  Future<Res<Login200Response>> login(@Body() LoginRequest req);

  @DELETE("/auth/logout")
  Future<void> logout();

  @GET("/courses")
  @Headers(postHeaders)
  Future<Res<GetCourses200Response>> getCourses();

  @GET("/courses/{courseId}/virtual-classrooms")
  @Headers(postHeaders)
  Future<Res<GetCourseVirtualClassrooms200Response>> getCourseVirtualClassrooms(
    @Path() int courseId, {
    @Query("live") bool? live,
  });

  @GET("/courses/{courseId}/files")
  @Headers(postHeaders)
  Future<Res<GetCourseFiles200Response>> getCourseFiles(@Path() int courseId);

  @GET("/people")
  @Headers(postHeaders)
  Future<Res<GetPeople200Response>> getPeople(@Query("search") String search);

  @GET("/people/{personId}")
  @Headers(postHeaders)
  Future<Res<GetPerson200Response>> getPerson(
    @Path() int personId,
  );
}
