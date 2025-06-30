import React from "react";
import { Table, Button, Input } from "antd";
import { Link } from 'react-router-dom';
import avatar2 from '../Assets/avatar2.png';

const MovieList = () => {
  const movies = [
    {
      _id: '1',
      name: 'Avata 2',
      durationFormatted: '2:30h',
      subtitle: 'Vietnamese',
      ageLimit: '18+',
      rating: 4,
      releaseData: '2024-09-13',
      image: avatar2,
      trailer: 'https://youtube.com',
    },

  ];

  const columns = [
    {
      title: 'Tên phim',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giờ chiếu',
      dataIndex: 'durationFormatted',
      key: 'duration',
    },
    {
      title: 'Phụ đề',
      dataIndex: 'subtitle',
      key: 'subtitle',
    },
    {
      title: 'Độ tuổi',
      dataIndex: 'ageLimit',
      key: 'ageLimit',
    },
    {
      title: 'Rate',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: 'Ngày chiếu',
      dataIndex: 'releaseData',
      key: 'releaseData',
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (src) => <img src={src} alt="movie" style={{ width: 50 }} />,
    },
    {
      title: 'Trailer',
      dataIndex: 'trailer',
      key: 'trailer',
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer">Xem Trailer</a>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Link to={`/movie/edit/${record._id}`}>
          <Button type="primary">Sửa</Button>
        </Link>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Danh sách Phim</h2>
      <Input.Search placeholder="Tìm kiếm..." allowClear style={{ marginBottom: 16, maxWidth: 300 }} />
      <Table
        columns={columns}
        dataSource={movies}
        rowKey="_id"
        bordered
      />
    </div>
  );
};

export default MovieList;
