import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user } = useContext(AuthContext);

  // Protected route wrapper
  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Navbar /> {/* Show navbar only when logged in */}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/feed" /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/feed" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/feed" /> : <Signup />} />

        {/* Protected routes */}
        <Route
          path="/feed"
          element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
