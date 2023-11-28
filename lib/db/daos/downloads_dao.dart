import 'package:drift/drift.dart';
import 'package:open_polito/db/database.dart';

part 'downloads_dao.g.dart';

@DriftAccessor(tables: [DbDownloadItem])
class DownloadsDao extends DatabaseAccessor<AppDatabase>
    with _$DownloadsDaoMixin {
  DownloadsDao(super.db);
}
