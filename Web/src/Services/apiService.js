import axios from 'axios';

// Base URL từ API documentation
const BASE_URL = 'https://my-backend-api-movie.onrender.com/api';

// Create axios instance với cấu hình mặc định
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8'
  },
  timeout: 10000 // 10 giây timeout
});

// Interceptor để thêm token vào request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để handle response và error
apiClient.interceptors.response.use(
  (response) => {
    console.log('🎯 API Response intercepted:', response.data);
    return response.data;
  },
  (error) => {
    console.error('❌ API Error intercepted:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      // Don't redirect in admin panel - just log the error
      console.warn('⚠️ Unauthorized access - token may be invalid');
    }
    
    return Promise.reject(error);
  }
);

// 🔐 Authentication APIs
export const authAPI = {
  login: (email, password) => 
    apiClient.post('/auth/login', { email, password }),
  
  register: (userData) => 
    apiClient.post('/auth/register', userData),
  
  logout: () => 
    apiClient.post('/auth/logout'),
  
  forgotPassword: (email) => 
    apiClient.post('/auth/forgot-password', { email }),
  
  resetPassword: (token, password) => 
    apiClient.post('/auth/reset-password', { token, password }),
};

// 👤 User Management APIs
export const userAPI = {
  getProfile: () => 
    apiClient.get('/user/profile'),
  
  updateProfile: (userData) => 
    apiClient.put('/user/update', userData),
  
  uploadAvatar: (formData) => 
    apiClient.post('/user/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  changePassword: (oldPassword, newPassword) => 
    apiClient.post('/user/change-password', { oldPassword, newPassword }),
};

// 🎬 Movie Management APIs
export const movieAPI = {
  // Lấy danh sách tất cả phim với phân trang
  getMovies: (params = {}) => {
    const { page = 1, limit = 20, ...otherParams } = params;
    return apiClient.get('/movies', { 
      params: { page, limit, ...otherParams } 
    });
  },
  
  // Chi tiết phim theo ID
  getMovieById: (id) => 
    apiClient.get(`/movies/${id}`),
  
  // Tìm kiếm phim
  searchMovies: (query, page = 1) => 
    apiClient.get('/movies/search', { 
      params: { q: query, page } 
    }),
  
  // Phim theo thể loại
  getMoviesByGenre: (genreId, page = 1) => 
    apiClient.get('/movies', { 
      params: { genre: genreId, page } 
    }),
  
  // Phim theo đạo diễn
  getMoviesByDirector: (directorId, page = 1) => 
    apiClient.get('/movies', { 
      params: { director: directorId, page } 
    }),
  
  // Phim theo diễn viên
  getMoviesByActor: (actorId, page = 1) => 
    apiClient.get('/movies', { 
      params: { actor: actorId, page } 
    }),
  
  // Phim đang chiếu
  getNowShowingMovies: (page = 1) => 
    apiClient.get('/movies', { 
      params: { status: 'now-showing', page } 
    }),
  
  // Phim sắp chiếu
  getComingSoonMovies: (page = 1) => 
    apiClient.get('/movies', { 
      params: { status: 'coming-soon', page } 
    }),
  
  // Top phim phổ biến
  getPopularMovies: (limit = 10) => 
    apiClient.get('/movies', { 
      params: { sort: '-rate', limit } 
    }),
  
  // Phim mới nhất
  getLatestMovies: (limit = 10) => 
    apiClient.get('/movies', { 
      params: { sort: '-release_date', limit } 
    }),
};

// 🎭 Theater & Cinema APIs
export const theaterAPI = {
  // Danh sách rạp chiếu
  getTheaters: () => 
    apiClient.get('/theaters'),
  
  // Thông tin rạp chi tiết
  getTheaterById: (id) => 
    apiClient.get(`/theaters/${id}`),
  
  // Lịch chiếu phim tại rạp
  getShowtimes: (theaterId, movieId) => 
    apiClient.get(`/theaters/${theaterId}/movies/${movieId}/showtimes`),
};

// 🎫 Booking Management APIs
export const bookingAPI = {
  // Tạo đặt vé mới
  createBooking: (bookingData) => 
    apiClient.post('/bookings', bookingData),
  
  // Danh sách vé đã đặt
  getBookings: () => 
    apiClient.get('/bookings'),
  
  // Chi tiết booking
  getBookingById: (id) => 
    apiClient.get(`/bookings/${id}`),
  
  // Hủy đặt vé
  cancelBooking: (id) => 
    apiClient.post(`/bookings/${id}/cancel`),
};

// 🛠️ Utility APIs
export const utilityAPI = {
  // Danh sách thể loại phim
  getGenres: () => 
    apiClient.get('/genres'),
  
  // Danh sách đạo diễn
  getDirectors: () => 
    apiClient.get('/directors'),
  
  // Danh sách diễn viên
  getActors: (params = {}) => 
    apiClient.get('/actors', { params }),
  
  // Upload hình ảnh
  uploadImage: (formData) => 
    apiClient.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

// Export default apiClient for custom requests
export default apiClient;
