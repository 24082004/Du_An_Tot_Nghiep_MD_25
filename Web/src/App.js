import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import AdminLogin from "./Pages/AdminLogin";
import Users from "./Pages/Users";
// import EmployeeList from "./Pages/EmployeeList";
// import EmployeeDetail from "./Pages/EmployeeDetail";
import MainLayout from "./Components/MainLayout";
import MovieList from "./Pages/MovieList";
// import AddMovie from "./Pages/AddMovie";
import DirectorList from "./Pages/DirectorList";
import RevenueStatistics from "./Pages/RevenueStatistics";
import AuthService from "./services/authService";
import ActorList from "./Pages/ActorList";
import FoodList from "./Pages/FoodList";
import CinemaList from "./Pages/CinemaList";
import DiscountList from "./Pages/DiscountList";
import RoomList from "./Pages/RoomList";
import SeatList from "./Pages/SeatList";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAdminAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

// Public Route Component (for login)
const PublicRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAdminAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Login Route - Public */}
      <Route
        path="/admin/login"
        element={
          <PublicRoute>
            <AdminLogin />
          </PublicRoute>
        }
      />

      {/* Default route - Redirect to login */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <RevenueStatistics />
          </ProtectedRoute>
        }
      />

      {/* <Route
        path="/admin/statistics"
        element={
          <ProtectedRoute>
            <RevenueStatistics />
          </ProtectedRoute>
        }
      /> */}

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/movie/list"
        element={
          <ProtectedRoute>
            <MovieList />
          </ProtectedRoute>
        }
      />

      {/* <Route
        path="/admin/addmovie"
        element={
          <ProtectedRoute>
            <AddMovie />
          </ProtectedRoute>
        }
      /> */}

      {/* <Route
        path="/admin/employees"
        element={
          <ProtectedRoute>
            <EmployeeList />
          </ProtectedRoute>
        }
      /> */}

      {/* <Route
        path="/admin/employees/:id"
        element={
          <ProtectedRoute>
            <EmployeeDetail />
          </ProtectedRoute>
        }
      /> */}

      <Route
        path="/admin/directors"
        element={
          <ProtectedRoute>
            <DirectorList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/actors"
        element={
          <ProtectedRoute>
            <ActorList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/foods"
        element={
          <ProtectedRoute>
            <FoodList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/cinemas"
        element={
          <ProtectedRoute>
            <CinemaList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/discounts"
        element={
          <ProtectedRoute>
            <DiscountList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/rooms"
        element={
          <ProtectedRoute>
            <RoomList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/seats"
        element={
          <ProtectedRoute>
            <SeatList />
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}

export default App;
