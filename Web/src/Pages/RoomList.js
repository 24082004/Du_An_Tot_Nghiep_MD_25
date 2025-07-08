import React from 'react';
import { Table, Button } from 'antd';

const RoomList = () => {
  const dataSource = [
    {
      key: '1',
      name: 'Phòng 1',
      movie: 'Quá Nhanh Quá Nguy Hiểm',
      showtimes: ['2024-08-06 - 07:00', '2024-08-06 - 18:00', '2024-08-06 - 22:30'],
      cinema: 'Rạp Mỹ Đình',
    },
    {
      key: '2',
      name: 'Phòng 2',
      movie: 'Đại Náo Võ Đường',
      showtimes: ['2024-08-06 - 07:00', '2024-08-06 - 18:00'],
      cinema: 'Rạp Thanh Xuân',
    },
    {
      key: '3',
      name: 'Phòng 3',
      movie: 'Cuộc Chiến Không Khoan Nhượng',
      showtimes: ['2024-08-06 - 08:00', '2024-08-06 - 20:00'],
      cinema: 'Rạp Mỹ Đình',
    },
    {
      key: '4',
      name: 'Phòng 4',
      movie: 'Thám Tử Lừng Danh',
      showtimes: ['2024-08-06 - 10:00', '2024-08-06 - 22:00'],
      cinema: 'Rạp Trung Hòa',
    },
    {
      key: '5',
      name: 'Phòng 5',
      movie: 'Hành Tinh Khỉ',
      showtimes: ['2024-08-06 - 11:00', '2024-08-06 - 17:30'],
      cinema: 'Rạp Mỹ Đình',
    },
  ];

  const columns = [
    {
      title: 'Stt',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phim',
      dataIndex: 'movie',
      key: 'movie',
    },
    {
      title: 'Thời Gian Chiếu',
      dataIndex: 'showtimes',
      key: 'showtimes',
      render: (times) => (
        <ul style={{ paddingLeft: 20 }}>
          {times.map((time, index) => (
            <li key={index}>{time}</li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Rạp',
      dataIndex: 'cinema',
      key: 'cinema',
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: () => (
        <>
          <Button type="primary" style={{ marginRight: 8 }}>Sửa</Button>
          <Button danger>Xoá</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Danh Sách Phòng</h2>
      <Table dataSource={dataSource} columns={columns} pagination={false} bordered />
    </div>
  );
};

export default RoomList;
