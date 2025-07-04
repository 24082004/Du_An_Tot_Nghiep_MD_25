import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './Pages/Dashboard';
import Users from './Pages/Users';
import EmployeeList from './Pages/EmployeeList';
import EmployeeDetail from './Pages/EmployeeDetail';
import MainLayout from './Components/MainLayout';
import MovieList from './Pages/MovieList';
import AddMovie from './Pages/AddMovie';
import CreateEmployee from './Pages/CreateEmployee';
import SeatManagement from './Pages/SeatManagement';

function App() {
  return (

    <MainLayout>
      <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path='/movie/list' element={<MovieList/>}/>
      <Route path='/addmovie' element={<AddMovie/>}/>
      <Route path="/employees" element={<EmployeeList/>} />
      <Route path="/employees/:id" element={<EmployeeDetail/>} />
      <Route path="/employees/create" element={<CreateEmployee/>} />
      <Route path="/seats" element={<SeatManagement />} />
    </Routes>
    </MainLayout>
  );
}

export default App;
