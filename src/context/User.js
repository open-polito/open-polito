import React, {createContext, useState} from 'react';

export const UserContext = createContext();

export default function UserProvider({children, user}) {
  const [_user, setUser] = useState(user);

  return (
    <UserContext.Provider value={{user: _user, setUser: setUser}}>
      {children}
    </UserContext.Provider>
  );
}
