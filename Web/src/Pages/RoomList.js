import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, Card, message, Input, Select, Badge, Tag, Modal } from 'antd';
import { 
  ReloadOutlined, 
  SearchOutlined, 
  BankOutlined,
  EyeOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import ApiService from '../services/ApiService';

const { Text, Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cinemas, setCinemas] = useState([]);
  const [loadingCinemas, setLoadingCinemas] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch rooms from API
  const fetchRooms = async (cinemaId = null) => {
    setLoading(true);
    try {
      const response = await ApiService.getRooms(cinemaId);
      
      if (response.success) {
        console.log('Rooms data:', response.data);
        setRooms(response.data);
        setFilteredRooms(response.data);
        message.success(`Đã tải ${response.data.length} phòng chiếu`);
      } else {
        message.error(response.message || 'Lỗi khi tải danh sách phòng chiếu');
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      message.error('Lỗi kết nối API: ' + error.message);
      
      // Fallback data nếu API lỗi
      const fallbackData = [
        {
          _id: '1',
          name: 'Phòng 1',
          cinema: { _id: '1', name: 'CGV Vincom Center', address: 'Bà Triệu, Hà Nội' }
        },
        {
          _id: '2',
          name: 'Phòng 2',
          cinema: { _id: '1', name: 'CGV Vincom Center', address: 'Bà Triệu, Hà Nội' }
        },
        {
          _id: '3',
          name: 'Phòng Platinum',
          cinema: { _id: '2', name: 'Galaxy Cinema', address: 'Nguyễn Du, TP. HCM' }
        },
      ];
      setRooms(fallbackData);
      setFilteredRooms(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cinemas for filter
  const fetchCinemas = async () => {
    setLoadingCinemas(true);
    try {
      const response = await ApiService.getCinemas();
      
      if (response.success) {
        setCinemas(response.data);
      } else {
        message.error(response.message || 'Lỗi khi tải danh sách rạp phim');
        setCinemas([]);
      }
    } catch (error) {
      console.error('Error fetching cinemas:', error);
      message.error('Lỗi kết nối API: ' + error.message);
      
      // Fallback data
      setCinemas([
        { _id: '1', name: 'CGV Vincom Center' },
        { _id: '2', name: 'Galaxy Cinema' },
        { _id: '3', name: 'BHD Star Cineplex' }
      ]);
    } finally {
      setLoadingCinemas(false);
    }
  };

  // Fetch room details
  const fetchRoomDetails = async (roomId) => {
    setLoadingDetails(true);
    try {
      const response = await ApiService.getRoomById(roomId);
      
      if (response.success) {
        setRoomDetails(response.data);
      } else {
        message.error(response.message || 'Lỗi khi tải chi tiết phòng chiếu');
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
      message.error('Lỗi kết nối API: ' + error.message);
      
      // Fallback data
      setRoomDetails({
        room: selectedRoom,
        seats: [],
        seatCount: 0
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchRooms();
    fetchCinemas();
  }, []);

  // Search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    filterRooms(value, selectedCinema);
  };

  // Cinema filter change
  const handleCinemaChange = (value) => {
    setSelectedCinema(value);
    fetchRooms(value === 'all' ? null : value);
  };

  // Filter rooms based on search text and selected cinema
  const filterRooms = (text, cinemaId) => {
    let filtered = [...rooms];
    
    // Filter by search text
    if (text) {
      filtered = filtered.filter(room => {
        return (
          room.name.toLowerCase().includes(text.toLowerCase()) ||
          (room.cinema && room.cinema.name.toLowerCase().includes(text.toLowerCase()))
        );
      });
    }
    
    setFilteredRooms(filtered);
  };

  // Handle room detail view
  const handleViewDetail = (room) => {
    setSelectedRoom(room);
    fetchRoomDetails(room._id);
    setDetailModalVisible(true);
  };

  // Close detail modal
  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedRoom(null);
    setRoomDetails(null);
  };

  const columns = [
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Text strong style={{ cursor: 'pointer' }} onClick={() => handleViewDetail(record)}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Rạp',
      dataIndex: 'cinema',
      key: 'cinema',
      render: (cinema) => cinema ? (
        <div>
          <Tag color="blue" icon={<BankOutlined />}>{cinema.name}</Tag>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            <EnvironmentOutlined /> {cinema.address || 'Chưa cập nhật địa chỉ'}
          </div>
        </div>
      ) : 'Không có thông tin',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button 
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24 
      }}>
        <Title level={2} style={{ margin: 0 }}>Danh sách phòng chiếu</Title>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />}
          onClick={() => fetchRooms(selectedCinema === 'all' ? null : selectedCinema)}
          loading={loading}
        >
          Làm mới
        </Button>
      </div>

      {/* Search and Filter */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Tìm kiếm</Text>
            </div>
            <Search
              placeholder="Tìm kiếm theo tên phòng..." 
              allowClear 
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              onSearch={handleSearch}
            />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ marginBottom: 8 }}>
              <Text strong>Lọc theo rạp</Text>
            </div>
            <Select
              style={{ width: '100%' }}
              placeholder="Chọn rạp"
              loading={loadingCinemas}
              value={selectedCinema}
              onChange={handleCinemaChange}
            >
              <Option value="all">Tất cả các rạp</Option>
              {cinemas.map(cinema => (
                <Option key={cinema._id} value={cinema._id}>{cinema.name}</Option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* Status */}
      <div style={{ marginBottom: 16 }}>
        <Text>
          Hiển thị {filteredRooms.length} / {rooms.length} phòng chiếu
        </Text>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredRooms}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} phòng chiếu`,
        }}
        bordered
      />

      {/* Room Detail Modal */}
      <Modal
        title={
          <div>
            <BankOutlined style={{ marginRight: 8 }} />
            Chi tiết phòng chiếu
          </div>
        }
        visible={detailModalVisible}
        onCancel={handleCloseDetailModal}
        footer={[
          <Button key="close" onClick={handleCloseDetailModal}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {loadingDetails ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div>Đang tải thông tin...</div>
          </div>
        ) : roomDetails ? (
          <div>
            <Card title="Thông tin cơ bản" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <Text strong>Tên phòng:</Text> {roomDetails.room.name}
                </div>
                <div>
                  <Text strong>Rạp:</Text> {roomDetails.room.cinema?.name || 'Không có thông tin'}
                </div>
                <div>
                  <Text strong>Địa chỉ rạp:</Text> {roomDetails.room.cinema?.address || 'Chưa cập nhật'}
                </div>
              </div>
            </Card>
            <Card title="Thông tin ghế ngồi">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <Badge 
                    count={roomDetails.seatCount} 
                    style={{ backgroundColor: '#52c41a' }} 
                    overflowCount={9999}
                  />
                  <Text style={{ marginLeft: 8 }}>Tổng số ghế trong phòng</Text>
                </div>
                {roomDetails.seatCount > 0 ? (
                  <div style={{ marginTop: 16 }}>
                    <Table
                      dataSource={roomDetails.seats}
                      rowKey="_id"
                      pagination={false}
                      size="small"
                      columns={[
                        {
                          title: 'Mã ghế',
                          dataIndex: 'seatNumber',
                          key: 'seatNumber',
                        },
                        {
                          title: 'Loại ghế',
                          dataIndex: 'type',
                          key: 'type',
                          render: (type) => {
                            let color = 'default';
                            switch(type) {
                              case 'vip':
                                color = 'gold';
                                break;
                              case 'couple':
                                color = 'magenta';
                                break;
                              case 'normal':
                              default:
                                color = 'blue';
                                break;
                            }
                            return <Tag color={color}>{type || 'normal'}</Tag>;
                          }
                        },
                        {
                          title: 'Hàng',
                          dataIndex: 'row',
                          key: 'row',
                        },
                        {
                          title: 'Cột',
                          dataIndex: 'column',
                          key: 'column',
                        }
                      ]}
                    />
                  </div>
                ) : (
                  <Text type="secondary">Chưa có thông tin ghế ngồi</Text>
                )}
              </div>
            </Card>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            Không có thông tin chi tiết
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RoomList;