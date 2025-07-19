import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Space, 
  message, 
  Popconfirm, 
  Card, 
  Select, 
  Upload, 
  Image,
  Tag,
  Rate,
  DatePicker,
  InputNumber,
  Spin,
  Alert
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  UploadOutlined, 
  EyeOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { movieAPI, utilityAPI } from '../Services/apiService';
import dayjs from 'dayjs';
import './Movies.css';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [genres, setGenres] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [actors, setActors] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20, // Tăng page size để hiển thị nhiều phim hơn
    total: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    genre: '',
    director: '',
    actor: ''
  });

  // Test API connection
  const testAPIConnection = async () => {
    try {
      const testResponse = await movieAPI.getMovies({ page: 1, limit: 1 });
      return testResponse.success === true;
    } catch (error) {
      return false;
    }
  };

  // Load dữ liệu ban đầu
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      
      try {
        // Load genres trước
        await loadGenres();
        
        // Thử load API trước với timeout
        let useApiData = false;
        try {
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('API timeout')), 10000)
          );
          
          const apiPromise = movieAPI.getMovies({ page: 1, limit: 20 });
          const response = await Promise.race([apiPromise, timeoutPromise]);
          
          if (response && response.success === true && Array.isArray(response.data)) {
            setMovies(response.data);
            setPagination({
              current: 1,
              pageSize: 20,
              total: response.count || response.data.length
            });
            useApiData = true;
            if (response.data.length > 0) {
              message.success(`Đã tải ${response.data.length} phim từ API`);
            } else {
              message.info('API kết nối thành công nhưng chưa có dữ liệu phim');
            }
          }
        } catch (apiError) {
          // Fallback to mock data if API fails
        }
        
        // Chỉ dùng mock data khi API không thành công
        if (!useApiData) {
          const mockMovies = getMockMovies();
          setMovies(mockMovies);
          setPagination({ current: 1, pageSize: 20, total: mockMovies.length });
          message.info('Đang sử dụng dữ liệu mẫu do API không khả dụng');
        }
        
        // Load thêm data khác
        loadDirectors();
        loadActors();
        
      } catch (error) {
        // Đảm bảo có mock data
        const mockMovies = getMockMovies();
        setMovies(mockMovies);
        setPagination({ current: 1, pageSize: 20, total: mockMovies.length });
      } finally {
        setLoading(false);
      }
    };
    
    initData();
  }, []);

  // Load danh sách phim
  const loadMovies = async (page = 1, pageSize = 20, searchQuery = '', filterParams = {}) => {
    try {
      setLoading(true);
      
      const params = {
        page,
        limit: pageSize
      };

      // Thêm filter params nếu có
      if (filterParams.genre && filterParams.genre !== '') {
        params.genre = filterParams.genre;
      }

      // Tạo timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API timeout')), 10000)
      );

      let apiPromise;
      if (searchQuery && searchQuery.trim() !== '') {
        apiPromise = movieAPI.searchMovies(searchQuery, page);
      } else {
        apiPromise = movieAPI.getMovies(params);
      }

      // Race between API call and timeout
      const response = await Promise.race([apiPromise, timeoutPromise]);

      // API trả về cấu trúc: { success, count, pagination, data }
      if (response && response.success === true && Array.isArray(response.data)) {
        let moviesData = response.data;
        
        // Filter theo status ở frontend (vì API không hỗ trợ)
        if (filterParams.status && filterParams.status !== '') {
          moviesData = filterMoviesByStatus(moviesData, filterParams.status);
        }
        
        setMovies(moviesData);
        setPagination({
          current: page,
          pageSize,
          total: moviesData.length
        });

        const filterInfo = [];
        if (filterParams.genre) filterInfo.push('thể loại');
        if (filterParams.status) filterInfo.push('trạng thái');
        const filterText = filterInfo.length > 0 ? ` (lọc theo ${filterInfo.join(', ')})` : '';
        
        message.success(`Đã tải ${moviesData.length} phim từ API${filterText}`);
      } else {
        throw new Error(`API response không hợp lệ`);
      }
    } catch (error) {
      message.error(`Lỗi tải phim: ${error.message}`);
      
      // Fallback với mock data
      const mockMovies = getMockMovies();
      let filteredMockData = mockMovies;
      
      if (filterParams.genre && filterParams.genre !== '') {
        filteredMockData = mockMovies.filter(movie => 
          movie.genre?.some(g => g._id === filterParams.genre) ||
          movie.genreNames?.some(name => genres.find(g => g._id === filterParams.genre)?.name === name)
        );
      }
      
      // Filter theo status
      if (filterParams.status && filterParams.status !== '') {
        filteredMockData = filterMoviesByStatus(filteredMockData, filterParams.status);
      }
      
      setMovies(filteredMockData);
      setPagination({ 
        current: page, 
        pageSize, 
        total: filteredMockData.length 
      });
      
      const filterInfo = [];
      if (filterParams.genre) filterInfo.push('thể loại');
      if (filterParams.status) filterInfo.push('trạng thái');
      const filterText = filterInfo.length > 0 ? ` (đã lọc theo ${filterInfo.join(', ')})` : '';
      
      message.info(`Hiển thị ${filteredMockData.length} phim mẫu${filterText}`);
    } finally {
      setLoading(false);
    }
  };

  // Load thể loại phim
  const loadGenres = async () => {
    try {
      const response = await utilityAPI.getGenres();
      
      if (response.success && response.data) {
        setGenres(response.data);
      } else {
        setGenres(response.data || response || []);
      }
    } catch (error) {
      // Fallback genres
      setGenres([
        { _id: '6852c38b297ccc7f09134023', name: 'Hành động' },
        { _id: '6852c398297ccc7f09134026', name: 'Phiêu lưu' },
        { _id: '6852c3a0297ccc7f09134029', name: 'Hài' },
        { _id: '6852c3aa297ccc7f0913402c', name: 'Hoạt hình' },
        { _id: '6852c3b0297ccc7f0913402f', name: 'Thần thoại' },
        { _id: '6852c3ba297ccc7f09134032', name: 'Hồi hộp' },
        { _id: '6852c3dc297ccc7f09134035', name: 'Kinh Dị' },
        { _id: '6852c41c297ccc7f09134038', name: 'Tâm Lý' }
      ]);
    }
  };

  // Load đạo diễn
  const loadDirectors = async () => {
    try {
      const response = await utilityAPI.getDirectors();
      setDirectors(response.data || response || []);
    } catch (error) {
      setDirectors([]);
    }
  };

  // Load diễn viên
  const loadActors = async () => {
    try {
      const response = await utilityAPI.getActors();
      setActors(response.data || response || []);
    } catch (error) {
      setActors([]);
    }
  };

  // Mock data để fallback
  const getMockMovies = () => {
    const mockData = [
      {
        _id: '1',
        id: '1',
        name: 'Avengers: Endgame',
        image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300',
        storyLine: 'Cuộc chiến cuối cùng của các siêu anh hùng để cứu vũ trụ',
        genre: [
          { _id: '6852c38b297ccc7f09134023', name: 'Hành động' },
          { _id: '6852c3b0297ccc7f0913402f', name: 'Thần thoại' }
        ],
        genreNames: ['Hành động', 'Thần thoại'],
        directorNames: ['Anthony Russo', 'Joe Russo'],
        actorNames: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo'],
        duration: '03:01:00',
        durationFormatted: '03:01:00',
        release_date: '2019-04-26T00:00:00.000Z', // Đã kết thúc
        rate: 8.4,
        spoken_language: 'English',
        subtitle: 'Phụ đề tiếng Việt',
        censorship: 'PG-13',
        trailer: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
        fullInfo: {
          directors: 'Anthony Russo, Joe Russo',
          actors: 'Robert Downey Jr., Chris Evans, Mark Ruffalo',
          genres: 'Hành động, Thần thoại'
        }
      },
      {
        _id: '2',
        id: '2', 
        name: 'Spider-Man: No Way Home',
        image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300',
        storyLine: 'Người nhện đối mặt với đa vũ trụ và những kẻ thù từ các thế giới khác',
        genre: [
          { _id: '6852c38b297ccc7f09134023', name: 'Hành động' },
          { _id: '6852c398297ccc7f09134026', name: 'Phiêu lưu' }
        ],
        genreNames: ['Hành động', 'Phiêu lưu'],
        directorNames: ['Jon Watts'],
        actorNames: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch'],
        duration: '02:28:00',
        durationFormatted: '02:28:00',
        release_date: '2021-12-17T00:00:00.000Z', // Đã kết thúc
        rate: 8.2,
        spoken_language: 'English',
        subtitle: 'Phụ đề tiếng Việt',
        censorship: 'PG-13',
        trailer: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
        fullInfo: {
          directors: 'Jon Watts',
          actors: 'Tom Holland, Zendaya, Benedict Cumberbatch',
          genres: 'Hành động, Phiêu lưu'
        }
      },
      {
        _id: '3',
        id: '3',
        name: 'The Batman',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
        storyLine: 'Người dơi trẻ tuổi đối mặt với tội phạm Gotham',
        genre: [
          { _id: '6852c38b297ccc7f09134023', name: 'Hành động' },
          { _id: '6852c3ba297ccc7f09134032', name: 'Hồi hộp' }
        ],
        genreNames: ['Hành động', 'Hồi hộp'],
        directorNames: ['Matt Reeves'],
        actorNames: ['Robert Pattinson', 'Zoë Kravitz'],
        duration: '02:56:00',
        durationFormatted: '02:56:00',
        release_date: '2025-07-10T00:00:00.000Z', // Đang chiếu (10 ngày trước)
        rate: 7.8,
        spoken_language: 'English',
        subtitle: 'Phụ đề tiếng Việt',
        censorship: 'PG-13',
        fullInfo: {
          directors: 'Matt Reeves',
          actors: 'Robert Pattinson, Zoë Kravitz',
          genres: 'Hành động, Hồi hộp'
        }
      },
      {
        _id: '4',
        id: '4',
        name: 'Dune: Part One',
        image: 'https://images.unsplash.com/photo-1596727147417-b86bd5783b2f?w=300',
        storyLine: 'Hành trình của Paul Atreides trên hành tinh sa mạc Arrakis',
        genre: [
          { _id: '6852c398297ccc7f09134026', name: 'Phiêu lưu' },
          { _id: '6852c3b0297ccc7f0913402f', name: 'Thần thoại' }
        ],
        genreNames: ['Phiêu lưu', 'Thần thoại'],
        directorNames: ['Denis Villeneuve'],
        actorNames: ['Timothée Chalamet', 'Rebecca Ferguson', 'Oscar Isaac'],
        duration: '02:35:00',
        durationFormatted: '02:35:00',
        release_date: '2025-06-15T00:00:00.000Z', // Đang chiếu (35 ngày trước, nhưng vẫn trong rạp)
        rate: 8.0,
        spoken_language: 'English',
        subtitle: 'Phụ đề tiếng Việt',
        censorship: 'PG-13',
        fullInfo: {
          directors: 'Denis Villeneuve',
          actors: 'Timothée Chalamet, Rebecca Ferguson, Oscar Isaac',
          genres: 'Phiêu lưu, Thần thoại'
        }
      },
      {
        _id: '5',
        id: '5',
        name: 'Coco',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
        storyLine: 'Câu chuyện về cậu bé Miguel và cuộc phiêu lưu đến vùng đất người chết',
        genre: [
          { _id: '6852c3aa297ccc7f0913402c', name: 'Hoạt hình' },
          { _id: '6852c398297ccc7f09134026', name: 'Phiêu lưu' }
        ],
        genreNames: ['Hoạt hình', 'Phiêu lưu'],
        directorNames: ['Lee Unkrich', 'Adrian Molina'],
        actorNames: ['Anthony Gonzalez', 'Gael García Bernal'],
        duration: '01:45:00',
        durationFormatted: '01:45:00',
        release_date: '2017-11-22T00:00:00.000Z',
        rate: 8.4,
        spoken_language: 'English',
        subtitle: 'Phụ đề tiếng Việt',
        censorship: 'G',
        fullInfo: {
          directors: 'Lee Unkrich, Adrian Molina',
          actors: 'Anthony Gonzalez, Gael García Bernal',
          genres: 'Hoạt hình, Phiêu lưu'
        }
      },
      {
        _id: '6',
        id: '6',
        name: 'The Conjuring',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
        storyLine: 'Câu chuyện về gia đình Perron và những hiện tượng siêu nhiên',
        genre: [
          { _id: '6852c3dc297ccc7f09134035', name: 'Kinh Dị' },
          { _id: '6852c3ba297ccc7f09134032', name: 'Hồi hộp' }
        ],
        genreNames: ['Kinh Dị', 'Hồi hộp'],
        directorNames: ['James Wan'],
        actorNames: ['Vera Farmiga', 'Patrick Wilson'],
        duration: '01:52:00',
        durationFormatted: '01:52:00',
        release_date: '2013-07-19T00:00:00.000Z', // Đã kết thúc
        rate: 7.5,
        spoken_language: 'English',
        subtitle: 'Phụ đề tiếng Việt',
        censorship: 'R',
        fullInfo: {
          directors: 'James Wan',
          actors: 'Vera Farmiga, Patrick Wilson',
          genres: 'Kinh Dị, Hồi hộp'
        }
      },
      {
        _id: '7',
        id: '7',
        name: 'Avatar: The Way of Water',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
        storyLine: 'Jake Sully sống với gia đình mới trên hành tinh Pandora',
        genre: [
          { _id: '6852c38b297ccc7f09134023', name: 'Hành động' },
          { _id: '6852c398297ccc7f09134026', name: 'Phiêu lưu' }
        ],
        genreNames: ['Hành động', 'Phiêu lưu'],
        directorNames: ['James Cameron'],
        actorNames: ['Sam Worthington', 'Zoe Saldaña', 'Sigourney Weaver'],
        duration: '03:12:00',
        durationFormatted: '03:12:00',
        release_date: '2025-07-01T00:00:00.000Z', // Đang chiếu (19 ngày trước)
        rate: 7.8,
        spoken_language: 'English',
        subtitle: 'Phụ đề tiếng Việt',
        censorship: 'PG-13',
        fullInfo: {
          directors: 'James Cameron',
          actors: 'Sam Worthington, Zoe Saldaña, Sigourney Weaver',
          genres: 'Hành động, Phiêu lưu'
        }
      },
      {
        _id: '8',
        id: '8',
        name: 'Fast X',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
        storyLine: 'Dominic Toretto và gia đình đối mặt với kẻ thù mới',
        genre: [
          { _id: '6852c38b297ccc7f09134023', name: 'Hành động' },
          { _id: '6852c3ba297ccc7f09134032', name: 'Hồi hộp' }
        ],
        genreNames: ['Hành động', 'Hồi hộp'],
        directorNames: ['Louis Leterrier'],
        actorNames: ['Vin Diesel', 'Michelle Rodriguez', 'Tyrese Gibson'],
        duration: '02:21:00',
        durationFormatted: '02:21:00',
        release_date: '2025-08-15T00:00:00.000Z', // Sắp chiếu
        rate: 7.0,
        spoken_language: 'English',
        subtitle: 'Phụ đề tiếng Việt',
        censorship: 'PG-13',
        fullInfo: {
          directors: 'Louis Leterrier',
          actors: 'Vin Diesel, Michelle Rodriguez, Tyrese Gibson',
          genres: 'Hành động, Hồi hộp'
        }
      },
      {
        _id: '9',
        id: '9',
        name: 'Transformers: Rise of the Beasts',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
        storyLine: 'Cuộc chiến mới giữa Autobots và Decepticons',
        genre: [
          { _id: '6852c38b297ccc7f09134023', name: 'Hành động' },
          { _id: '6852c398297ccc7f09134026', name: 'Phiêu lưu' }
        ],
        genreNames: ['Hành động', 'Phiêu lưu'],
        directorNames: ['Steven Caple Jr.'],
        actorNames: ['Anthony Ramos', 'Dominique Fishback'],
        duration: '02:07:00',
        durationFormatted: '02:07:00',
        release_date: '2025-07-15T00:00:00.000Z', // Đang chiếu (5 ngày trước)
        rate: 7.2,
        spoken_language: 'English',
        subtitle: 'Phụ đề tiếng Việt',
        censorship: 'PG-13',
        fullInfo: {
          directors: 'Steven Caple Jr.',
          actors: 'Anthony Ramos, Dominique Fishback',
          genres: 'Hành động, Phiêu lưu'
        }
      },
      {
        _id: '10',
        id: '10',
        name: 'Oppenheimer',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
        storyLine: 'Câu chuyện về nhà vật lý J. Robert Oppenheimer',
        genre: [
          { _id: '6852c41c297ccc7f09134038', name: 'Tâm Lý' },
          { _id: '6852c3ba297ccc7f09134032', name: 'Hồi hộp' }
        ],
        genreNames: ['Tâm Lý', 'Hồi hộp'],
        directorNames: ['Christopher Nolan'],
        actorNames: ['Cillian Murphy', 'Emily Blunt', 'Robert Downey Jr.'],
        duration: '03:00:00',
        durationFormatted: '03:00:00',
        release_date: '2025-06-20T00:00:00.000Z', // Đang chiếu (30 ngày trước)
        rate: 8.9,
        spoken_language: 'English',
        subtitle: 'Phụ đề tiếng Việt',
        censorship: 'R',
        fullInfo: {
          directors: 'Christopher Nolan',
          actors: 'Cillian Murphy, Emily Blunt, Robert Downey Jr.',
          genres: 'Tâm Lý, Hồi hộp'
        }
      }
    ];
    return mockData;
  };

  // Force load mock data for debugging
  const forceLoadMockData = () => {
    const mockMovies = getMockMovies();
    setMovies(mockMovies);
    setPagination({ 
      current: 1, 
      pageSize: 20, 
      total: mockMovies.length 
    });
    message.success(`Đã tải ${mockMovies.length} phim mẫu`);
  };

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    loadMovies(1, pagination.pageSize, value, filters);
  };

  // Xử lý filter
  const handleFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    loadMovies(1, pagination.pageSize, searchText, newFilters);
  };

  // Tính toán trạng thái phim dựa trên ngày chiếu
  const getMovieStatus = (releaseDate) => {
    if (!releaseDate) return 'unknown';
    
    const today = new Date();
    const release = new Date(releaseDate);
    const twoMonthsAgo = new Date(today);
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    
    if (release > today) {
      return 'coming-soon';
    } else if (release >= twoMonthsAgo) {
      return 'now-showing';
    } else {
      return 'ended';
    }
  };

  // Filter movies theo trạng thái
  const filterMoviesByStatus = (moviesData, statusFilter) => {
    if (!statusFilter || statusFilter === '') {
      return moviesData;
    }

    const filtered = moviesData.filter(movie => {
      const movieStatus = getMovieStatus(movie.release_date || movie.releaseDate);
      return movieStatus === statusFilter;
    });
    
    return filtered;
  };

  // Xử lý phân trang
  const handleTableChange = (paginationInfo) => {
    loadMovies(paginationInfo.current, paginationInfo.pageSize, searchText, filters);
  };

  // Refresh data
  const handleRefresh = () => {
    setSearchText('');
    setFilters({ status: '', genre: '', director: '', actor: '' });
    loadMovies();
  };

  // Định nghĩa columns cho table
  const columns = [
    {
      title: 'Poster',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image, record) => (
        <Image
          src={image || record.poster || 'https://via.placeholder.com/60x90/f0f0f0/666?text=No+Image'}
          alt={record.name || record.title}
          width={60}
          height={90}
          style={{ objectFit: 'cover', borderRadius: 4 }}
          fallback="https://via.placeholder.com/60x90/f0f0f0/666?text=No+Image"
        />
      )
    },
    {
      title: 'Tên phim',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {name || record.title || record.movieTitle || 'Không có tên'}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {record.spoken_language || record.language || 'N/A'} • {record.censorship || record.ageRating || record.age_rating || 'N/A'}
          </div>
        </div>
      )
    },
    {
      title: 'Thể loại',
      dataIndex: 'genre',
      key: 'genre',
      width: 150,
      render: (genres, record) => {
        // API có sẵn genreNames (array of strings) - ưu tiên dùng này
        const genreNames = record.genreNames || [];
        
        if (genreNames.length > 0) {
          return (
            <div>
              {genreNames.map((genreName, index) => (
                <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                  {genreName}
                </Tag>
              ))}
            </div>
          );
        }
        
        // Fallback với genre array (objects)
        const genreData = genres || record.genres || record.category || [];
        
        if (Array.isArray(genreData)) {
          return (
            <div>
              {genreData.map((genre, index) => (
                <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                  {typeof genre === 'object' ? (genre.name || genre.title || genre) : genre}
                </Tag>
              ))}
            </div>
          );
        } else if (typeof genreData === 'object' && genreData) {
          return <Tag color="blue">{genreData.name || genreData.title || 'N/A'}</Tag>;
        } else if (genreData) {
          return <Tag color="blue">{genreData}</Tag>;
        } else {
          return <Tag color="default">Chưa phân loại</Tag>;
        }
      }
    },
    {
      title: 'Đạo diễn',
      dataIndex: 'director',
      key: 'director',
      width: 150,
      ellipsis: true,
      render: (director, record) => {
        // API có sẵn directorNames (array of strings) - ưu tiên dùng này
        const directorNames = record.directorNames || [];
        
        if (directorNames.length > 0) {
          return directorNames.join(', ');
        }
        
        // Hoặc dùng fullInfo.directors
        if (record.fullInfo?.directors) {
          return record.fullInfo.directors;
        }
        
        // Fallback với director array (objects)
        const directorData = director || record.directors || record.director_name;
        
        if (typeof directorData === 'object' && directorData) {
          return directorData.name || directorData.fullName || directorData.director_name || 'N/A';
        } else if (Array.isArray(directorData) && directorData.length > 0) {
          return directorData.map(d => typeof d === 'object' ? d.name : d).join(', ');
        } else {
          return directorData || 'Chưa có thông tin';
        }
      }
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (duration) => `${duration} phút`
    },
    {
      title: 'Ngày chiếu',
      dataIndex: 'release_date',
      key: 'release_date',
      width: 120,
      render: (date, record) => {
        const releaseDate = date || record.releaseDate;
        return dayjs(releaseDate).format('DD/MM/YYYY');
      }
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rate',
      key: 'rate',
      width: 120,
      render: (rating, record) => {
        const rate = rating || record.rating || 0;
        return (
          <div>
            <Rate disabled defaultValue={rate / 2} />
            <div style={{ fontSize: 12, color: '#666' }}>{rate}/10</div>
          </div>
        );
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status, record) => {
        // Tính toán trạng thái dựa trên ngày chiếu
        const calculatedStatus = getMovieStatus(record.release_date || record.releaseDate);
        const finalStatus = status || calculatedStatus;
        
        const statusConfig = {
          'now-showing': { color: 'green', text: 'Đang chiếu' },
          'coming-soon': { color: 'blue', text: 'Sắp chiếu' },
          'ended': { color: 'red', text: 'Đã kết thúc' },
          'unknown': { color: 'default', text: 'Chưa rõ' }
        };
        const config = statusConfig[finalStatus] || { color: 'default', text: finalStatus };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            title="Xem chi tiết"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa phim này?"
            onConfirm={() => handleDelete(record._id || record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              title="Xóa"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const handleView = (record) => {
    Modal.info({
      title: record.name || record.title,
      width: 800,
      content: (
        <div style={{ padding: '16px 0' }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <Image
              src={record.image || record.poster}
              width={150}
              height={225}
              style={{ objectFit: 'cover', borderRadius: 8 }}
            />
            <div style={{ flex: 1 }}>
              <p><strong>Mô tả:</strong> {record.storyLine || record.description || 'Chưa có mô tả'}</p>
              <p><strong>Thể loại:</strong> {record.fullInfo?.genres || (record.genreNames && record.genreNames.join(', ')) || 'N/A'}</p>
              <p><strong>Đạo diễn:</strong> {record.fullInfo?.directors || (record.directorNames && record.directorNames.join(', ')) || 'N/A'}</p>
              <p><strong>Diễn viên:</strong> {record.fullInfo?.actors || (record.actorNames && record.actorNames.join(', ')) || 'N/A'}</p>
              <p><strong>Thời lượng:</strong> {record.durationFormatted || record.duration} phút</p>
              <p><strong>Ngôn ngữ:</strong> {record.spoken_language || record.language || 'N/A'}</p>
              <p><strong>Phụ đề:</strong> {record.subtitle || 'N/A'}</p>
              <p><strong>Phân loại:</strong> {record.censorship || record.ageRating || 'N/A'}</p>
              <p><strong>Đánh giá:</strong> {record.rate || record.rating}/10</p>
            </div>
          </div>
          {record.trailer && (
            <div>
              <strong>Trailer:</strong>
              <a href={record.trailer} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8 }}>
                Xem trailer
              </a>
            </div>
          )}
        </div>
      )
    });
  };

  const handleEdit = (record) => {
    setEditingMovie(record);
    form.setFieldsValue({
      ...record,
      releaseDate: record.releaseDate ? dayjs(record.releaseDate) : null
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      // TODO: Implement delete API call
      message.success('Xóa phim thành công');
      loadMovies(pagination.current, pagination.pageSize, searchText, filters);
    } catch (error) {
      message.error('Không thể xóa phim');
    }
  };

  // Test API connection immediately
  const testApiNow = async () => {
    try {
      setLoading(true);
      message.info('Đang test API...');
      
      const response = await movieAPI.getMovies({ page: 1, limit: 5 });
      console.log('Test API Response:', response);
      
      if (response && response.success === true && Array.isArray(response.data)) {
        setMovies(response.data);
        setPagination({
          current: 1,
          pageSize: 20,
          total: response.count || response.data.length
        });
        message.success(`✅ API hoạt động! Tải được ${response.data.length} phim`);
      } else {
        message.error('API phản hồi không đúng format');
      }
    } catch (error) {
      console.error('Test API Error:', error);
      message.error(`API lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="movies-container">
      <Card>
        <div className="movies-header">
          <h2>Quản lý phim</h2>
          <div className="movies-actions">
            <Space wrap>
              <Input.Search
                placeholder="Tìm kiếm phim..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={handleSearch}
                style={{ width: 250 }}
                enterButton={<SearchOutlined />}
              />
              
              <Select
                placeholder="Trạng thái"
                style={{ width: 120 }}
                value={filters.status}
                onChange={(value) => handleFilter('status', value)}
                allowClear
              >
                <Option value="now-showing">Đang chiếu</Option>
                <Option value="coming-soon">Sắp chiếu</Option>
                <Option value="ended">Đã kết thúc</Option>
              </Select>

              <Select
                placeholder="Thể loại"
                style={{ width: 150 }}
                value={filters.genre}
                onChange={(value) => handleFilter('genre', value)}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {genres.map(genre => (
                  <Option key={genre._id} value={genre._id}>
                    {genre.name}
                  </Option>
                ))}
              </Select>

              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                title="Làm mới"
              />

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
              >
                Thêm phim mới
              </Button>

              <Button
                icon={<SearchOutlined />}
                onClick={testApiNow}
                title="Kiểm tra kết nối API"
              />
            </Space>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>Đang tải danh sách phim...</div>
          </div>
        ) : (
          <>
            <Alert
              message={
                movies.length === 0 
                  ? "Không có dữ liệu"
                  : movies.length <= 8
                    ? "Đang hiển thị dữ liệu mẫu" 
                    : "Dữ liệu từ API thực"
              }
              description={
                movies.length === 0
                  ? "Không có phim nào để hiển thị"
                  : movies.length <= 8 
                    ? `Hiển thị ${movies.length} phim ${filters.genre || filters.status ? `(đã lọc${filters.genre ? ' theo thể loại' : ''}${filters.status ? ' theo trạng thái' : ''})` : 'mẫu'}`
                    : `Hiển thị ${movies.length} phim từ server API ${filters.genre || filters.status ? `(Đã lọc${filters.genre ? ' theo thể loại' : ''}${filters.status ? ' theo trạng thái' : ''})` : ''}`
              }
              type={
                movies.length === 0 
                  ? 'error'
                  : movies.length <= 8 
                    ? 'warning' 
                    : 'success'
              }
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Table
              columns={columns}
              dataSource={movies}
              rowKey="_id"
              loading={loading}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} phim`,
                pageSizeOptions: ['10', '20', '50', '100']
              }}
              onChange={handleTableChange}
              scroll={{ x: 1200 }}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default Movies;
