import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  Upload, 
  TimePicker, 
  InputNumber,
  Switch,
  Row,
  Col,
  Divider,
  Steps,
  message,
  Space,
  Tag,
  Image,
  Alert
} from 'antd';
import { 
  PlusOutlined, 
  UploadOutlined, 
  SaveOutlined,
  ArrowLeftOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  TeamOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './CreateCinema.css';

const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;

const CreateCinema = ({ onBack, onSave }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  // Danh sách tiện ích có sẵn
  const facilityOptions = [
    { value: 'parking', label: 'Bãi đỗ xe', icon: '🅿️', color: '#1890ff' },
    { value: '3d', label: 'Màn hình 3D', icon: '🥽', color: '#52c41a' },
    { value: 'imax', label: 'IMAX', icon: '🎬', color: '#722ed1' },
    { value: '4dx', label: '4DX', icon: '💺', color: '#fa541c' },
    { value: 'vip', label: 'Phòng VIP', icon: '👑', color: '#faad14' },
    { value: 'food_court', label: 'Khu ẩm thực', icon: '🍿', color: '#eb2f96' },
    { value: 'game_zone', label: 'Khu vui chơi', icon: '🎮', color: '#13c2c2' },
    { value: 'wifi', label: 'WiFi miễn phí', icon: '📶', color: '#1890ff' },
    { value: 'air_condition', label: 'Điều hòa', icon: '❄️', color: '#52c41a' },
    { value: 'accessibility', label: 'Tiếp cận khuyết tật', icon: '♿', color: '#722ed1' }
  ];

  // Danh sách thành phố
  const cities = [
    'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng',
    'Bình Dương', 'Đồng Nai', 'Khánh Hòa', 'Lâm Đồng', 'Quảng Nam'
  ];

  const steps = [
    {
      title: 'Thông tin cơ bản',
      icon: <HomeOutlined />,
      description: 'Tên rạp và thông tin liên hệ'
    },
    {
      title: 'Địa chỉ & Vị trí',
      icon: <EnvironmentOutlined />,
      description: 'Địa chỉ chi tiết và vị trí'
    },
    {
      title: 'Tiện ích & Dịch vụ',
      icon: <TeamOutlined />,
      description: 'Các tiện ích và dịch vụ'
    },
    {
      title: 'Hình ảnh & Hoàn thành',
      icon: <SaveOutlined />,
      description: 'Upload hình ảnh và xác nhận'
    }
  ];

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      message.error('Vui lòng điền đầy đủ thông tin bắt buộc');
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFacilityToggle = (facilityValue) => {
    const newFacilities = selectedFacilities.includes(facilityValue)
      ? selectedFacilities.filter(f => f !== facilityValue)
      : [...selectedFacilities, facilityValue];
    setSelectedFacilities(newFacilities);
    form.setFieldsValue({ facilities: newFacilities });
  };

  const handleImageUpload = ({ fileList }) => {
    setImageList(fileList);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const cinemaData = {
        ...values,
        facilities: selectedFacilities,
        images: imageList.map(img => img.url || img.response?.url),
        openTime: values.openTime?.format('HH:mm'),
        closeTime: values.closeTime?.format('HH:mm'),
        createdAt: new Date().toISOString(),
        status: 'active'
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success('Tạo rạp chiếu phim thành công!');
      if (onSave) {
        onSave(cinemaData);
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo rạp');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="step-content">
            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Alert
                  message="Thông tin cơ bản"
                  description="Nhập tên rạp và các thông tin liên hệ cơ bản"
                  type="info"
                  showIcon
                  style={{ marginBottom: 24 }}
                />
              </Col>
              
              <Col xs={24} lg={12}>
                <Form.Item
                  name="name"
                  label="Tên rạp chiếu phim"
                  rules={[{ required: true, message: 'Vui lòng nhập tên rạp' }]}
                >
                  <Input 
                    prefix={<HomeOutlined />}
                    placeholder="VD: CGV Vincom Center"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12}>
                <Form.Item
                  name="manager"
                  label="Quản lý rạp"
                  rules={[{ required: true, message: 'Vui lòng nhập tên quản lý' }]}
                >
                  <Input 
                    prefix={<TeamOutlined />}
                    placeholder="VD: Nguyễn Văn A"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                  ]}
                >
                  <Input 
                    prefix={<PhoneOutlined />}
                    placeholder="VD: 024-3936-3636"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email' },
                    { type: 'email', message: 'Email không hợp lệ' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />}
                    placeholder="VD: info@cgv.vn"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12}>
                <Form.Item
                  name="totalScreens"
                  label="Số phòng chiếu"
                  rules={[{ required: true, message: 'Vui lòng nhập số phòng chiếu' }]}
                >
                  <InputNumber
                    min={1}
                    max={50}
                    placeholder="VD: 8"
                    size="large"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12}>
                <Form.Item
                  name="capacity"
                  label="Tổng số ghế"
                  rules={[{ required: true, message: 'Vui lòng nhập tổng số ghế' }]}
                >
                  <InputNumber
                    min={50}
                    max={5000}
                    placeholder="VD: 1200"
                    size="large"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case 1:
        return (
          <div className="step-content">
            <Row gutter={[24, 16]}>
              <Col span={24}>
                <Alert
                  message="Thông tin địa chỉ"
                  description="Nhập địa chỉ chi tiết và vị trí của rạp"
                  type="info"
                  showIcon
                  style={{ marginBottom: 24 }}
                />
              </Col>

              <Col xs={24} lg={12}>
                <Form.Item
                  name="city"
                  label="Thành phố"
                  rules={[{ required: true, message: 'Vui lòng chọn thành phố' }]}
                >
                  <Select
                    placeholder="Chọn thành phố"
                    size="large"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {cities.map(city => (
                      <Option key={city} value={city}>{city}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} lg={12}>
                <Form.Item
                  name="district"
                  label="Quận/Huyện"
                  rules={[{ required: true, message: 'Vui lòng nhập quận/huyện' }]}
                >
                  <Input 
                    placeholder="VD: Hai Bà Trưng"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="address"
                  label="Địa chỉ chi tiết"
                  rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết' }]}
                >
                  <Input 
                    prefix={<EnvironmentOutlined />}
                    placeholder="VD: 191 Bà Triệu"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12}>
                <Form.Item
                  name="latitude"
                  label="Vĩ độ (Latitude)"
                >
                  <InputNumber
                    placeholder="VD: 21.0285"
                    size="large"
                    style={{ width: '100%' }}
                    step={0.000001}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12}>
                <Form.Item
                  name="longitude"
                  label="Kinh độ (Longitude)"
                >
                  <InputNumber
                    placeholder="VD: 105.8542"
                    size="large"
                    style={{ width: '100%' }}
                    step={0.000001}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12}>
                <Form.Item
                  name="openTime"
                  label="Giờ mở cửa"
                  rules={[{ required: true, message: 'Vui lòng chọn giờ mở cửa' }]}
                >
                  <TimePicker
                    format="HH:mm"
                    placeholder="Chọn giờ mở cửa"
                    size="large"
                    style={{ width: '100%' }}
                    defaultValue={dayjs('08:00', 'HH:mm')}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12}>
                <Form.Item
                  name="closeTime"
                  label="Giờ đóng cửa"
                  rules={[{ required: true, message: 'Vui lòng chọn giờ đóng cửa' }]}
                >
                  <TimePicker
                    format="HH:mm"
                    placeholder="Chọn giờ đóng cửa"
                    size="large"
                    style={{ width: '100%' }}
                    defaultValue={dayjs('23:00', 'HH:mm')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Alert
                  message="Tiện ích và dịch vụ"
                  description="Chọn các tiện ích và dịch vụ có tại rạp"
                  type="info"
                  showIcon
                  style={{ marginBottom: 24 }}
                />
              </Col>

              <Col span={24}>
                <Form.Item name="facilities" label="Tiện ích có sẵn">
                  <div className="facilities-grid">
                    {facilityOptions.map(facility => (
                      <div
                        key={facility.value}
                        className={`facility-card ${selectedFacilities.includes(facility.value) ? 'selected' : ''}`}
                        onClick={() => handleFacilityToggle(facility.value)}
                      >
                        <div className="facility-icon" style={{ color: facility.color }}>
                          {facility.icon}
                        </div>
                        <div className="facility-label">{facility.label}</div>
                      </div>
                    ))}
                  </div>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Divider>Thông tin bổ sung</Divider>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Mô tả về rạp"
                >
                  <TextArea
                    rows={4}
                    placeholder="Mô tả chi tiết về rạp chiếu phim, các đặc điểm nổi bật..."
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12}>
                <Form.Item
                  name="website"
                  label="Website"
                >
                  <Input 
                    placeholder="VD: https://www.cgv.vn"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} lg={12}>
                <Form.Item
                  name="socialMedia"
                  label="Facebook/Social Media"
                >
                  <Input 
                    placeholder="VD: https://facebook.com/cgvcinemas"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Alert
                  message="Hình ảnh và hoàn thành"
                  description="Upload hình ảnh rạp và xem lại thông tin trước khi lưu"
                  type="success"
                  showIcon
                  style={{ marginBottom: 24 }}
                />
              </Col>

              <Col span={24}>
                <Form.Item
                  name="images"
                  label="Hình ảnh rạp"
                >
                  <Upload
                    listType="picture-card"
                    fileList={imageList}
                    onChange={handleImageUpload}
                    beforeUpload={() => false}
                    multiple
                  >
                    {imageList.length >= 8 ? null : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                  <div style={{ marginTop: 8, color: '#666' }}>
                    * Có thể upload tối đa 8 hình ảnh. Định dạng: JPG, PNG
                  </div>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Card title="Xem lại thông tin" style={{ marginTop: 16 }}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} lg={12}>
                      <div className="review-item">
                        <strong>Tên rạp:</strong> {form.getFieldValue('name')}
                      </div>
                      <div className="review-item">
                        <strong>Quản lý:</strong> {form.getFieldValue('manager')}
                      </div>
                      <div className="review-item">
                        <strong>Số phòng chiếu:</strong> {form.getFieldValue('totalScreens')}
                      </div>
                    </Col>
                    <Col xs={24} lg={12}>
                      <div className="review-item">
                        <strong>Địa chỉ:</strong> {form.getFieldValue('address')}, {form.getFieldValue('district')}, {form.getFieldValue('city')}
                      </div>
                      <div className="review-item">
                        <strong>Liên hệ:</strong> {form.getFieldValue('phone')} | {form.getFieldValue('email')}
                      </div>
                    </Col>
                    <Col span={24}>
                      <div className="review-item">
                        <strong>Tiện ích:</strong>
                        <div style={{ marginTop: 8 }}>
                          {selectedFacilities.map(facilityValue => {
                            const facility = facilityOptions.find(f => f.value === facilityValue);
                            return (
                              <Tag key={facilityValue} color={facility?.color} style={{ margin: '2px' }}>
                                {facility?.icon} {facility?.label}
                              </Tag>
                            );
                          })}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="create-cinema-container">
      <Card className="create-cinema-card">
        <div className="create-cinema-header">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={onBack}
            type="text"
            size="large"
          >
            Quay lại
          </Button>
          <h2>Tạo rạp chiếu phim mới</h2>
          <div></div>
        </div>

        <Steps current={currentStep} className="create-cinema-steps">
          {steps.map((step, index) => (
            <Step
              key={index}
              title={step.title}
              description={step.description}
              icon={step.icon}
            />
          ))}
        </Steps>

        <Form
          form={form}
          layout="vertical"
          className="create-cinema-form"
        >
          {renderStepContent()}
        </Form>

        <div className="create-cinema-actions">
          {currentStep > 0 && (
            <Button size="large" onClick={handlePrev}>
              Quay lại
            </Button>
          )}
          <div className="actions-right">
            {currentStep < steps.length - 1 ? (
              <Button type="primary" size="large" onClick={handleNext}>
                Tiếp theo
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                icon={<SaveOutlined />}
                loading={loading}
                onClick={handleSubmit}
              >
                Tạo rạp
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateCinema;
