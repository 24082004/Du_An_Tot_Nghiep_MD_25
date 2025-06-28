import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const mockEmployees = [
  {
    id: '1',
    name: 'Duy Khánh Staff',
    email: 'khanhdev289@gmail.com',
    phone: '0378332809',
    birth: '1999-09-28',
    gender: 'Nam',
    role: 'staff',
    status: 'active',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
];

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const employee = mockEmployees.find(emp => emp.id === id);

  if (!employee) {
    return <div style={{ padding: 24 }}>Không tìm thấy nhân viên!</div>;
  }

  return (
    <div style={{ padding: '24px', textAlign: 'center' }}>
      <h2>Chi tiết nhân viên</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img src={employee.avatar} alt="avatar" style={{ width: 250, marginRight: 32 }} />
        <div style={{ textAlign: 'left' }}>
          <p><strong>Họ Tên:</strong> {employee.name}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Số điện thoại:</strong> {employee.phone}</p>
          <p><strong>Ngày sinh:</strong> {employee.birth}</p>
          <p><strong>Giới tính:</strong> {employee.gender}</p>
          <p><strong>Quyền:</strong> {employee.role}</p>
          <p><strong>Trạng thái:</strong> {employee.status}</p>
          <div style={{ marginTop: 20 }}>
            <button style={{ marginRight: 10 }}>Sửa thông tin</button>
            <button style={{ marginRight: 10 }}>Đổi mật khẩu</button>
            <button onClick={() => navigate('/employees')}>Quay lại</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
