'use client';
import { Auth } from 'aws-amplify';
import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useEffect, useMemo, useState } from 'react';

export interface User {
  email: string;
  name: string;
  userId: string;
  organizationId: string;
}

type UserContextData = {
  currentUser?: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

export const UserContext = createContext<UserContextData | undefined>(
  undefined
);

interface UserContextProviderProperties {
  children: React.ReactNode;
}

const pagesNotRequiringLogin = new Set(['/', '/login', '/register']);

export default function UserContextProvider({
  children,
}: UserContextProviderProperties) {
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
        const {
          email,
          'custom:user_id': userId,
          'custom:organization_id': organizationId,
          given_name,
          family_name,
        } = newUser.attributes;
        setCurrentUser({
          email,
          name: `${given_name} ${family_name}`,
          userId,
          organizationId,
        });
      })
      .catch(() => {
        console.log(path);
        if (!pagesNotRequiringLogin.has(path)) {
          router.push('/login');
        }
      });
  }, [path, router]);

  return (
    <UserContext.Provider value={userContextProviderValue}>
      {children}
    </UserContext.Provider>
  );
}
