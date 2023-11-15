import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:open_polito/api/models/models.dart';
import 'package:open_polito/models/models.dart';

part 'search.freezed.dart';

@freezed
sealed class SearchResult with _$SearchResult {
  const factory SearchResult.files(
    List<FileSearchResultItem> items,
    // TODO: books
  ) = FilesSearchResult;
  const factory SearchResult.recordings(List<CourseVirtualClassroom> items) =
      RecordingsSearchResult;
  const factory SearchResult.people(List<ApiPersonOverview> items) =
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
