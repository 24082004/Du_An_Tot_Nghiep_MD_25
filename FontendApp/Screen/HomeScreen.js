import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import MovieService from '../servicess/MovieService';

export default function HomeScreen({ navigation }) {
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allMovies = await MovieService.getNowShowing(); // dùng getNowShowing là getAll
        const currentDate = new Date();

        // Tự lọc bằng release_date
        const now = allMovies.filter(m => new Date(m.release_date) <= currentDate);
        const soon = allMovies.filter(m => new Date(m.release_date) > currentDate);

        setNowShowing(now);
        setComingSoon(soon);
      } catch (error) {
        console.error('Lỗi khi tải phim', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Chào, Cinema</Text>
        <Text style={styles.welcome}>Chào mừng bạn quay lại</Text>
        <TextInput
          style={styles.search}
          placeholder="Tìm kiếm"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Đang chiếu</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {nowShowing.map((movie, index) => (
            <TouchableOpacity
              key={movie._id || index}
              onPress={() =>
                navigation.navigate('MovieDetail', {
                  movie: {
                    title: movie.name,
                    duration: movie.durationFormatted || movie.duration,
                    releaseDate: new Date(movie.release_date).toLocaleDateString('vi-VN'),
                    genre: movie.genreNames?.join(', ') || 'Đang cập nhật',
                    rating: movie.rate,
                    votes: movie.votes || 0,
                    posterUrl: movie.image,
                    description: movie.description || 'Đang cập nhật',
                    director: movie.directorNames || movie.director || [],
                    actors: movie.actorNames || movie.actors || []
                  },
                })
              }
            >
              <View style={styles.nowPlayingItem}>
                <Image
                  source={{ uri: movie.image }}
                  style={styles.nowPlayingPoster}
                  resizeMode="cover"
                />
                <Text style={styles.movieTitle}>{movie.name}</Text>
                <Text style={styles.movieDetail}>
                  {movie.durationFormatted || movie.duration} ·{' '}
                  {movie.genreNames?.join(', ') || '...'}
                </Text>
                <Text style={styles.movieRating}>⭐ {movie.rate}/10</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sắp chiếu</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {comingSoon.map((movie, index) => (
            <TouchableOpacity
              key={movie._id || index}
              style={styles.comingItem}
              onPress={() =>
                navigation.navigate('MovieDetail', {
                  movie: {
                    title: movie.name,
                    duration: movie.durationFormatted || movie.duration,
                    releaseDate: new Date(movie.release_date).toLocaleDateString('vi-VN'),
                    genre: movie.genreNames?.join(', ') || 'Đang cập nhật',
                    rating: movie.rate,
                    votes: movie.votes || 0,
                    posterUrl: movie.image,
                    description: movie.description || 'Đang cập nhật',
                  },
                })
              }
            >
              <Image
                source={{ uri: movie.image }}
                style={styles.comingPoster}
                resizeMode="cover"
              />
              <Text style={styles.movieTitle} numberOfLines={2}>
                {movie.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
  header: {
    marginBottom: 10,
    marginTop: 40,
  },
  greeting: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  welcome: {
    color: '#fff',
    fontSize: 14,
  },
  search: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 8,
    color: '#fff',
    marginTop: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  nowPlayingItem: {
    marginRight: 10,
    width: 200,
  },
  nowPlayingPoster: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 5,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  comingItem: {
  marginRight: 10,
  width: 140,
  alignItems: 'center',
  },

  comingPoster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 6,
  },

  movieTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    width: 120,
  },

  movieRating: {
    color: '#ffc107',
    fontSize: 12,
  },
  promo: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
});
