// AuthContext.js
import React, { createContext, useState, useEffect,useContext } from 'react';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem('isAdmin') === 'true'
  );
  const [user, setUser] = useState(localStorage.getItem('user') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setIsAdmin(true);
    setUser(userData.username);
    setRole(userData.role);
    localStorage.setItem('isAdmin', true);
    localStorage.setItem('user', userData.username);
    localStorage.setItem('role', userData.role);
  };

  const logout = () => {
    setIsAdmin(false);
    setUser(null);
    setRole(null);
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  };

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('isAdmin');
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    if (storedLoggedIn && storedUser && storedRole) {
      setIsAdmin(storedLoggedIn === 'true');
      setUser(storedUser);
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  const value = { isAdmin, user, role, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
