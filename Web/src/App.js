import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './Pages/Dashboard';
import Users from './Pages/Users';
import MainLayout from './Components/MainLayout';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path = "/" element={<Dashboard/>}/>
        <Route path = "/users" element={<Users/>}/>
      </Routes>
    </MainLayout>
  );
}

export default App;
