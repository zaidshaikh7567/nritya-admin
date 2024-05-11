// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import secureLocalStorage from 'react-secure-storage';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(
    secureLocalStorage.getItem('isAdmin') === 'Yes'
  );
  const [user, setUser] = useState(secureLocalStorage.getItem('user') || null);
  const [role, setRole] = useState(
    secureLocalStorage.getItem('role') || null
  );
  const [darkMode, setDarkMode] = useState(
    secureLocalStorage.getItem('darkMode') === 'true'
  );
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setIsAdmin(true);
    setUser(userData.username);
    setRole(userData.role);
    secureLocalStorage.setItem('isAdmin', true);
    secureLocalStorage.setItem('user', userData.username);
    secureLocalStorage.setItem('role', String(userData.role));
    //console.log(userData)
  };

  const logout = () => {
    setIsAdmin(false);
    setUser(null);
    setRole(null);
    secureLocalStorage.removeItem('isAdmin');
    secureLocalStorage.removeItem('user');
    secureLocalStorage.removeItem('role');
  };

  const toggleDarkMode = () => {
    const newDarkModeState = !darkMode;
    setDarkMode(newDarkModeState);
    secureLocalStorage.setItem('darkMode', String(newDarkModeState));
  };

  useEffect(() => {
    const storedLoggedIn = secureLocalStorage.getItem('isAdmin');
    const storedUser = secureLocalStorage.getItem('user');
    const storedRole = secureLocalStorage.getItem('role');
    if (storedLoggedIn && storedUser && storedRole) {
      setIsAdmin(storedLoggedIn);
      setUser(storedUser);
      setRole(storedRole);
    }
    setLoading(false);
  }, []);

  const value = {isAdmin,user,role,darkMode,toggleDarkMode,login,logout};

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
