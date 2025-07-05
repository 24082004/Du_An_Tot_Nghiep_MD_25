import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './Pages/Dashboard';
import Users from './Pages/Users';
import EmployeeList from './Pages/EmployeeList';
import EmployeeDetail from './Pages/EmployeeDetail';
import MainLayout from './Components/MainLayout';
import DirectorList from './Pages/DirectorList';
import BookingHistory from './Pages/BookingHistory';
import TicketDetail from './Pages/TicketDetail';

function App() {
  return (

    <MainLayout>
      <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path="/employees" element={<EmployeeList/>} />
      <Route path="/employees/:id" element={<EmployeeDetail/>} />
      <Route path="/directors" element={<DirectorList />} />
      <Route path="/bookings" element={<BookingHistory />} />
      <Route path="/bookings/:id" element={<TicketDetail />} />
    </Routes>
    </MainLayout>
  );
}

export default App;
