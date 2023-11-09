class InMemoryCache<T> {
  final Map<String, CacheItem<T>> _cache = {};

  InMemoryCache();

  /// Insert item into cache
  void put(String key, T item, Duration duration) {
    final createdAt = DateTime.now();
    final expiresAt = createdAt.add(duration);
    final cacheItem = CacheItem(item, createdAt, expiresAt);
    _cache[key] = cacheItem;
  }

  /// Check if item is valid
  bool isValid(CacheItem item) {
    final now = DateTime.now();
    if (now.isAfter(item.expiresAt)) {
      return false;
    }

    return true;
  }

  /// Get item from cache
  T? get(String key) {
    final item = _cache[key];
    if (item != null && isValid(item)) {
      return item.item;
    }

    // If item is not valid, also remove it from cache
    remove(key);

    return null;
  }

  /// Remove item from the cache
  void remove(String key) {
    _cache.remove(key);
  }

  /// Clear the cache
  void clear() {
    _cache.clear();
  }

  /// Inspects the whole cache, and removes invalid items.
  void checkAll() {
    for (final entry in _cache.entries) {
      if (!isValid(entry.value)) {
        remove(entry.key);
      }
    }
  }
}

class CacheItem<T> {
  final T item;
  final DateTime createdAt;
  final DateTime expiresAt;

  const CacheItem(this.item, this.createdAt, this.expiresAt);
}
