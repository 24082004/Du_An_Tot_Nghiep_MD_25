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
import BookingHistory from './Pages/BookingHistory';
import TicketDetail from './Pages/TicketDetail';
import CreateDirector from './Pages/CreateDirector';

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
      <Route path="/bookings" element={<BookingHistory />} />
      <Route path="/bookings/:id" element={<TicketDetail />} />
      <Route path="/directors/create" element={<CreateDirector />} />
    </Routes>
    </MainLayout>
  );
}

export default App;
