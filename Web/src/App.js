import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './Pages/Dashboard';
import Users from './Pages/Users';
import EmployeeList from './Pages/EmployeeList';
import EmployeeDetail from './Pages/EmployeeDetail';
import MainLayout from './Components/MainLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path="/employees" element={<MainLayout><EmployeeList /></MainLayout>} />
      <Route path="/employees/:id" element={<MainLayout><EmployeeDetail /></MainLayout>} />
    </Routes>
  );
}

export default App;
