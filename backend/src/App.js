import React from 'react';
import { Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Dashboard from './Pages/Dashboard';
import Users from './Pages/Users';

function App() {
  return (
      <Routes>
        <Route path = "/" element={<Dashboard/>}/>
        <Route path = "/users" element={<Users/>}/>
      </Routes>
  );
}

export default App;
