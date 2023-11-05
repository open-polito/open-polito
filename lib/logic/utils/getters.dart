import 'package:get_it/get_it.dart';
import 'package:open_polito/data/key_value_store.dart';
import 'package:open_polito/data/secure_store.dart';

final _g = GetIt.I;

KvStore getKvStore() => _g.get<KvStore>();

ISecureStore getSecureStore() => _g.get<ISecureStore>();
