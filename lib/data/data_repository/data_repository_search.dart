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
          final processedQuery = query.toLowerCase().trim();

          if (processedQuery == "") {
            return null;
          }

          final defaultNow = DateTime.now();

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

              files.sort(
                (a, b) {
                  final firstTerm = sortOrder == SortOrder.desc ? b : a;
                  final lastTerm = sortOrder == SortOrder.desc ? a : b;
                  return switch (sortBy) {
                    SortBy.createdAt => firstTerm.file.createdAt
                        .compareTo(lastTerm.file.createdAt),
                    SortBy.name =>
                      firstTerm.file.name.compareTo(lastTerm.file.name),
                    SortBy.size =>
                      firstTerm.file.sizeKB.compareTo(lastTerm.file.sizeKB),
                  };
                },
              );

              return SearchResult.files(files);
            case SearchCategory.people:
              final people = (await req(() => api.getPeople(processedQuery)))
                      ?.data
                      .map((e) => e)
                      .toList() // create a new list to avoid mutation
                  ??
                  [];

              people.sort((a, b) {
                final firstTerm = sortOrder == SortOrder.desc ? b : a;
                final lastTerm = sortOrder == SortOrder.desc ? a : b;

                // Comparison by name, with the last name having
                // higher priority than the first name.

                final cmp =
                    firstTerm.lastName?.compareTo(lastTerm.lastName ?? "") ?? 0;
                if (cmp == 0) {
                  return firstTerm.firstName
                          ?.compareTo(lastTerm.firstName ?? "") ??
                      0;
                }

                return cmp;
              });

              return SearchResult.people(people);
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

              recordings.sort(
                (a, b) {
                  final firstTerm = sortOrder == SortOrder.desc ? b : a;
                  final lastTerm = sortOrder == SortOrder.desc ? a : b;
                  return switch (sortBy) {
                    SortBy.createdAt => firstTerm.recording?.createdAt
                            ?.compareTo(
                                lastTerm.recording?.createdAt ?? defaultNow) ??
                        0,
                    SortBy.name => firstTerm.recording?.title
                            ?.compareTo(lastTerm.recording?.title ?? "") ??
                        0,
                    SortBy.size => 0,
                  };
                },
              );

              return SearchResult.recordings(recordings);
          }
        },
        demo: () => null,
      );
}
