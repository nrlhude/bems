// frontend/src/contexts/AuthContext.js
// AuthContext.js

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Initialize with null or fetch from localStorage

  const login = (user) => {
    // Handle login logic, set currentUser, and store token in localStorage
    setCurrentUser(user);
  };

  const logout = () => {
    // Handle logout logic, clear currentUser, and remove token from localStorage
    setCurrentUser(null);
  };

  const isAuthenticated = () => {
    return currentUser !== null;
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
