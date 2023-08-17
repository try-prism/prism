'use client';

import { useEffect, useState } from 'react';

import Sidebar from '@/components/Sidebar';
import { TEST_ADMIN_ID, TEST_TOKEN } from '@/constant';
import { Page } from '@/constants/Navigation';
import { Convert, User } from '@/models/User';

export default function AccountPage() {
  const [user, setUser] = useState<User>();
  const userId = TEST_ADMIN_ID;
  const token = TEST_TOKEN;

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify({ token, userId }),
      });
      const data = await response.json();

      if (data.status !== 200) {
        console.log(data.message);
      }

      const userData = Convert.toUser(data.user);
      setUser(userData);
    };

    fetchUserData();
  }, [token, userId]);

  return (
    <div className="bg-white min-h-screen">
      <Sidebar selectedPage={Page.ADMIN} />
      {user && (
        <main className="xl:pl-72 py-2">
          <div className="pl-4 pr-2 flex flex-col gap-y-3">{user.id}</div>
        </main>
      )}
    </div>
  );
}
