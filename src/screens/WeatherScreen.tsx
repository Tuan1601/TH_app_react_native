
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
}

const API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; 
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const WeatherScreen: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchWeather = async (): Promise<void> => {
    if (!city.trim()) {
      setError('Vui lòng nhập tên thành phố');
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(
        `${API_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=vi`,
      );
      const data = await response.json();

      if (response.ok) {
        setWeather(data);
      } else {
        setError(data.message || 'Không tìm thấy thành phố');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string): string => {
    const icons: Record<string, string> = {
      Clear: '☀️',
      Clouds: '☁️',
      Rain: '🌧️',
      Drizzle: '🌦️',
      Thunderstorm: '⛈️',
      Snow: '❄️',
      Mist: '🌫️',
      Fog: '🌫️',
    };
    return icons[condition] || '🌤️';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Thời tiết</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên thành phố (VD: Hanoi)"
            value={city}
            onChangeText={setCity}
            onSubmitEditing={fetchWeather}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={fetchWeather}
            disabled={loading}>
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Đang tải...</Text>
          </View>
        )}

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {weather && !loading && (
          <View style={styles.weatherContainer}>
            <View style={styles.cityHeader}>
              <Text style={styles.cityName}>{weather.name}</Text>
              <Text style={styles.country}>{weather.sys.country}</Text>
            </View>

            <View style={styles.mainWeather}>
              <Text style={styles.weatherIcon}>
                {getWeatherIcon(weather.weather[0].main)}
              </Text>
              <Text style={styles.temperature}>
                {Math.round(weather.main.temp)}°C
              </Text>
              <Text style={styles.description}>
                {weather.weather[0].description}
              </Text>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailCard}>
                <Text style={styles.detailIcon}>🌡️</Text>
                <Text style={styles.detailLabel}>Cảm giác như</Text>
                <Text style={styles.detailValue}>
                  {Math.round(weather.main.feels_like)}°C
                </Text>
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.detailIcon}>💧</Text>
                <Text style={styles.detailLabel}>Độ ẩm</Text>
                <Text style={styles.detailValue}>{weather.main.humidity}%</Text>
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.detailIcon}>🌬️</Text>
                <Text style={styles.detailLabel}>Gió</Text>
                <Text style={styles.detailValue}>
                  {weather.wind.speed} m/s
                </Text>
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.detailIcon}>👁️</Text>
                <Text style={styles.detailLabel}>Tầm nhìn</Text>
                <Text style={styles.detailValue}>
                  {(weather.visibility / 1000).toFixed(1)} km
                </Text>
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.detailIcon}>⬆️</Text>
                <Text style={styles.detailLabel}>Cao nhất</Text>
                <Text style={styles.detailValue}>
                  {Math.round(weather.main.temp_max)}°C
                </Text>
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.detailIcon}>⬇️</Text>
                <Text style={styles.detailLabel}>Thấp nhất</Text>
                <Text style={styles.detailValue}>
                  {Math.round(weather.main.temp_min)}°C
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 16,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
    elevation: 2,
  },
  searchButton: {
    backgroundColor: '#2196F3',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  searchButtonText: {
    fontSize: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorText: {
    color: '#c62828',
    fontSize: 16,
    textAlign: 'center',
  },
  weatherContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },
  cityHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cityName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  country: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  mainWeather: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  weatherIcon: {
    fontSize: 80,
    marginBottom: 12,
  },
  temperature: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  description: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
    textTransform: 'capitalize',
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  detailCard: {
    width: '33.33%',
    padding: 12,
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default WeatherScreen;