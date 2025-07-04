import React, { useState } from "react";
import {DatePicker, Select, Button, Table, Row, Col, Typography, Card,} from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const { Title, Text } = Typography;
const { Option } = Select;

const RevenueStatistics = () => {
  const [selectedMovie, setSelectedMovie] = useState("Cuu Long Thanh Trai Vay Ham");

  const chartData = [
    {
      name: "Rạp Mỹ Đình",
      total: 460000,
    },
  ];

  const movieData = [
    {
      key: "1",
      movie: "Lý Tiểu Long",
      total: 1212000,
      tickets: 9,
    },
    {
      key: "2",
      movie: "Cuu Long Thanh Trai Vay Ham",
      total: 460000,
      tickets: 4,
    },
  ];

  const cinemaData = [
    {
      key: "1",
      cinema: "Rạp Mỹ Đình",
      total: 1336000,
    },
    {
      key: "2",
      cinema: "Rạp Long Biên",
      total: 336000,
    },
  ];

  const movieColumns = [
    {
      title: "Phim",
      dataIndex: "movie",
    },
    {
      title: "Tổng Tiền",
      dataIndex: "total",
    },
    {
      title: "Số Vé",
      dataIndex: "tickets",
    },
  ];

  const cinemaColumns = [
    {
      title: "Rạp",
      dataIndex: "cinema",
    },
    {
      title: "Tổng Tiền",
      dataIndex: "total",
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ textAlign: "center" }}>
        Thống Kê Doanh Thu
      </Title>

      <Row gutter={16} style={{ marginBottom: 20, justifyContent: "center" }}>
        <Col>
          <Select
            value={selectedMovie}
            onChange={setSelectedMovie}
            style={{ width: 250 }}
          >
            <Option value="Lý Tiểu Long">Lý Tiểu Long</Option>
            <Option value="Cuu Long Thanh Trai Vay Ham">
              Cuu Long Thanh Trai Vay Ham
            </Option>
          </Select>
        </Col>
        <Col>
          <DatePicker placeholder="From Date" format="DD/MM/YYYY" />
        </Col>
        <Col>
          <DatePicker placeholder="To Date" format="DD/MM/YYYY" />
        </Col>
        <Col>
          <Button type="primary">Filter</Button>
        </Col>
      </Row>

      <Card title="Doanh thu" style={{ marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#1890ff" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Text strong style={{ fontSize: 16 }}>
        Tổng doanh thu : 460,000$
      </Text>

      <Row gutter={24} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Title level={5}>Doanh thu theo phim</Title>
          <Table
            dataSource={movieData}
            columns={movieColumns}
            pagination={false}
            bordered
          />
        </Col>
        <Col span={12}>
          <Title level={5}>Doanh thu theo rạp</Title>
          <Table
            dataSource={cinemaData}
            columns={cinemaColumns}
            pagination={false}
            bordered
          />
        </Col>
      </Row>
    </div>
  );
};

export default RevenueStatistics;
