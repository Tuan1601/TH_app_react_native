import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Article {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function ArticlesScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, articles]);

  const loadArticles = async (pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${pageNum}&_limit=${ITEMS_PER_PAGE}`
      );
      const data = await response.json();

      if (data.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      if (isLoadMore) {
        setArticles(prev => [...prev, ...data]);
      } else {
        setArticles(data);
        setHasMore(true);
      }

      setPage(pageNum);
    } catch (error) {
      console.error('Lỗi khi tải bài viết:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredArticles(articles);
      return;
    }

    const filtered = articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.body.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredArticles(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setSearchQuery('');
    loadArticles(1);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !searchQuery) {
      loadArticles(page + 1, true);
    }
  };

  const renderItem = ({ item }: { item: Article }) => (
    <View style={styles.articleItem}>
      <View style={styles.articleHeader}>
        <Text style={styles.articleId}>#{item.id}</Text>
        <Text style={styles.userId}>User {item.userId}</Text>
      </View>
      <Text style={styles.articleTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.articleBody} numberOfLines={3}>
        {item.body}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.footerText}>Đang tải thêm...</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery ? '🔍 Không tìm thấy bài viết' : '📄 Chưa có bài viết'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách bài viết</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm kiếm bài viết..."
          placeholderTextColor="#999"
        />
        {searchQuery ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        data={filteredArticles}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#000',
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 18,
    color: '#999',
  },
  articleItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  articleId: {
    fontWeight: 'bold',
  },
  userId: {
    fontStyle: 'italic',
    color: '#666',
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  articleBody: {
    fontSize: 14,
    color: '#333',
  },
  footerLoader: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 8,
    color: '#666',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
