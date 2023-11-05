import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:open_polito/api/models/people.dart';
import 'package:open_polito/models/courses.dart';

part 'search.freezed.dart';

@freezed
sealed class SearchResult with _$SearchResult {
  const factory SearchResult.files(
    Iterable<FileSearchResultItem> items,
    // TODO: lecture recordings
    // TODO: people
    // TODO: books
  ) = FilesSearchResult;
  const factory SearchResult.recordings(Iterable<VirtualClassroom> items) =
      RecordingsSearchResult;
  const factory SearchResult.people(Iterable<PersonOverview> items) =
      PeopleSearchResult;
}

@freezed
class FileSearchResultItem with _$FileSearchResultItem {
  const factory FileSearchResultItem({
    required int courseId,
    required CourseFileInfo file,
  }) = _FileSearchResultItem;
}

enum SearchCategory {
  files,
  recordings,
  people,
}
