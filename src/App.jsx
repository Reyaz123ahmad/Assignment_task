import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import UserList from './components/UserList';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app">
      {isAuthenticated && <Navbar />}
      <div className="container">
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/users" /> : <Login />} 
          />
          <Route 
            path="/users/*" 
            element={isAuthenticated ? <UserList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/users" : "/login"} />} 
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
