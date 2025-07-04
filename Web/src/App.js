import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Users from './Pages/Users';
import EmployeeList from './Pages/EmployeeList';
import EmployeeDetail from './Pages/EmployeeDetail';
import MainLayout from './Components/MainLayout';
import MovieList from './Pages/MovieList';
import AddMovie from './Pages/AddMovie';
import DirectorList from './Pages/DirectorList';
import RevenueStatistics from './Pages/RevenueStatistics';

function App() {
  return (

    <MainLayout>
      <Routes>
      <Route path="/statistics" element={<RevenueStatistics />} />
      <Route path="/users" element={<Users />} />
      <Route path='/movie/list' element={<MovieList/>}/>
      <Route path='/addmovie' element={<AddMovie/>}/>
      <Route path="/employees" element={<EmployeeList/>} />
      <Route path="/employees/:id" element={<EmployeeDetail/>} />
      <Route path="/directors" element={<DirectorList />} />
    </Routes>
    </MainLayout>
  );
}

export default App;
