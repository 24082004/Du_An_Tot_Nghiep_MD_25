// API Configuration
const API_CONFIG = {
  BASE_URL: 'https://my-backend-api-movie.onrender.com/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8'
  }
};

// API Endpoints
const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_OTP: '/auth/resend-otp'
  },
  
  // User Management
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    UPLOAD_AVATAR: '/user/upload-avatar',
    CHANGE_PASSWORD: '/user/change-password'
  },
  
  // Movie Management
  MOVIES: {
    LIST: '/movies',
    DETAIL: '/movies',
    SEARCH: '/movies/search',
    BY_GENRE: '/movies',
    BY_DIRECTOR: '/movies',
    BY_ACTOR: '/movies',
    NOW_SHOWING: '/movies',
    COMING_SOON: '/movies',
    POPULAR: '/movies',
    LATEST: '/movies'
  },
  
  // Theater & Cinema
  THEATERS: {
    LIST: '/theaters',
    DETAIL: '/theaters',
    SHOWTIMES: '/theaters'
  },
  
  // Booking Management
  BOOKINGS: {
    CREATE: '/bookings',
    LIST: '/bookings',
    DETAIL: '/bookings',
    CANCEL: '/bookings'
  },
  
  // Utility
  UTILITY: {
    GENRES: '/genres',
    DIRECTORS: '/directors',
    ACTORS: '/actors',
    UPLOAD_IMAGE: '/upload/image'
  }
};

// Status Codes
const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Error Messages
const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng kiểm tra internet.',
  TIMEOUT_ERROR: 'Hết thời gian chờ. Vui lòng thử lại.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền truy cập.',
  NOT_FOUND: 'Không tìm thấy dữ liệu.',
  SERVER_ERROR: 'Lỗi hệ thống. Vui lòng thử lại sau.',
  UNKNOWN_ERROR: 'Có lỗi xảy ra. Vui lòng thử lại.'
};

export {
  API_CONFIG,
  API_ENDPOINTS,
  STATUS_CODES,
  ERROR_MESSAGES
};
