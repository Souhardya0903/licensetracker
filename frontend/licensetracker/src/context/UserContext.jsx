import React, { createContext, useState, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        return { token: storedToken, name: decodedToken.sub }; // Use email (sub) as name
      } catch (error) {
        return null;
      }
    }
    return null;
  });

  const login = (token) => {
    localStorage.setItem('authToken', token);
    try {
      const decodedToken = jwtDecode(token);
      setUser({ token, name: decodedToken.sub });
    } catch (error) {
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
