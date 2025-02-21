import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Vehicles from './pages/Vehicles';
import Users from './pages/Users';
import NavBar from './components/NavBar';
import './App.css';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? (
    <>
      <NavBar />
      {children}
    </>
  ) : (
    <Navigate to="/login" />
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/vehicles"
            element={
              <PrivateRoute>
                <Vehicles />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/vehicles" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
