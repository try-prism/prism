'use client';
import { Auth } from 'aws-amplify';
import { createContext, useEffect, useMemo, useState } from 'react';

export interface User {
  email: string;
  name: string;
}

type UserContextData = {
  currentUser?: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

export const UserContext = createContext<UserContextData | undefined>(
  undefined
);

interface UserContextProviderProps {
  children: React.ReactNode;
}

export default function UserContextProvider({
  children,
}: UserContextProviderProps) {
  const [currentUser, setCurrentUser] = useState<User>();

  const userContextProviderValue = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
    }),
    [currentUser]
  );

  // Provide the current user info globally.
  useEffect(() => {
    Auth.currentAuthenticatedUser().then(newUser => {
      const { email, given_name, family_name } = newUser.attributes;
      setCurrentUser({ email, name: `${given_name} ${family_name}` });
    });
  }, []);

  return (
    <UserContext.Provider value={userContextProviderValue}>
      {children}
    </UserContext.Provider>
  );
}
