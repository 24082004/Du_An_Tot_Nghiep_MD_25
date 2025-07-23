import React, { useEffect, useState } from "react";
import { Table, Button, Input, message } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs"; // Dùng để format ngày

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("https://my-backend-api-movie.onrender.com/api/movies");
        const data = res.data?.data || [];
        setMovies(data);
        setFilteredMovies(data);
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        message.error("Không thể tải danh sách phim.");
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = (value) => {
    setSearchKeyword(value);
    const filtered = movies.filter((movie) =>
      movie.name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMovies(filtered);
  };

  const columns = [
    {
      title: "Tên phim",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giờ chiếu",
      dataIndex: "durationFormatted",
      key: "durationFormatted",
    },
    {
      title: "Phụ đề",
      dataIndex: "subtitle",
      key: "subtitle",
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
    },
    {
      title: "Ngày chiếu",
      dataIndex: "release_date",
      key: "release_date",
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (src) => (
        <img src={src || "https://via.placeholder.com/50"} alt="movie" style={{ width: 50 }} />
      ),
    },
    {
      title: "Trailer",
      dataIndex: "trailer",
      key: "trailer",
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            Xem Trailer
          </a>
        ) : (
          "Chưa có"
        ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Link to={`/movie/edit/${record._id}`}>
          <Button type="primary">Sửa</Button>
        </Link>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Danh sách Phim</h2>
      <Input.Search
        placeholder="Tìm kiếm..."
        allowClear
        value={searchKeyword}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 300 }}
      />
      <Table columns={columns} dataSource={filteredMovies} rowKey="_id" bordered />
    </div>
  );
};

export default MovieList;
