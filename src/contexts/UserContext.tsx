'use client';
import { Auth } from 'aws-amplify';
import { usePathname, useRouter } from 'next/navigation';
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

const pagesNotRequiringLogin = new Set(['/', '/login', '/register']);

export default function UserContextProvider({
  children,
}: UserContextProviderProps) {
  const [currentUser, setCurrentUser] = useState<User>();
  const router = useRouter();
  const path = usePathname();

  const userContextProviderValue = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
    }),
    [currentUser]
  );

  // Provide the current user info globally.
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(newUser => {
        const { email, user_id, organization_id, given_name, family_name } =
          newUser.attributes;
        setCurrentUser({
          email,
          name: `${given_name} ${family_name}`,
        });
      })
      .catch(() => {
        if (!pagesNotRequiringLogin.has(path)) {
          router.push('/login');
        }
      });
  }, []);

  return (
    <UserContext.Provider value={userContextProviderValue}>
      {children}
    </UserContext.Provider>
  );
}
