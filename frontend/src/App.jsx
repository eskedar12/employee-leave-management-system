import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import PrivateRoute from './components/PrivateRoute';
import Register from './pages/Register';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/employee-dashboard"
            element={
              <PrivateRoute allowedRoles={['employee']}>
                <EmployeeDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/manager-dashboard"
            element={
              <PrivateRoute allowedRoles={['manager']}>
                <ManagerDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;