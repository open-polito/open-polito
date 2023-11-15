part of 'data_repository.dart';

extension DataRepositorySearch on DataRepository {
  /// Get search results.
  ///
  /// TODO: better search mechanism.
  /// TODO: use [sortOrder] and [sortBy].
  FutureOr<SearchResult?> getSearchResults(
    String query, {
    required SearchCategory category,
    required SortOrder sortOrder,
    required SortBy sortBy,
  }) =>
      demoDefault(
        real: () async {
          final processedQuery = query.toLowerCase();
          switch (category) {
            case SearchCategory.files:
              final files = <FileSearchResultItem>[];
              final courses = await getCourses() ?? [];
              for (final course in courses) {
                final filesMatchingQuery = ((await getCourseMaterial(
                                course.id, course.name))
                            ?.whereType<CourseFileInfo>() ??
                        [])
                    .where((element) => element.name.contains(processedQuery));
                files.addAll(filesMatchingQuery.map(
                    (e) => FileSearchResultItem(courseId: course.id, file: e)));
              }
              return SearchResult.files(files);
            case SearchCategory.people:
              final people =
                  (await req(() => api.getPeople(processedQuery)))?.data;
              return SearchResult.people(people ?? []);
            case SearchCategory.recordings:
              final recordings = <CourseVirtualClassroom>[];
              final courses = await getCourses() ?? [];
              for (final course in courses) {
                final courseVCs =
                    (await getCourseVirtualClassrooms(course.id, course.name) ??
                            [])
                        .where((element) {
                  final recData = element.recording;
                  if (recData == null) {
                    return false;
                  }
                  final title = recData.title;
                  if (title == null) {
                    return false;
                  }
                  return title.toLowerCase().contains(processedQuery);
                });

                recordings.addAll(courseVCs);
              }

              return SearchResult.recordings(recordings);
          }
        },
        demo: () => null,
      );
}
