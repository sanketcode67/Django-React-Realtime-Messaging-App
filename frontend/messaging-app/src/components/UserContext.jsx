import React, { createContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  return (
    <UserContext.Provider value={{ user, userId, setUser, setUserId  }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };