'use client';

import { useEffect } from 'react';

import IntegrationCards from '@/components/IntegrationCards';
import PeopleList from '@/components/PeopleList';
import Sidebar from '@/components/Sidebar';
import { TEST_ORG_ID, TEST_TOKEN } from '@/constant';
import { Page } from '@/constants/Navigation';

export default function AdminPage() {
  const organizationId = TEST_ORG_ID;
  const token = TEST_TOKEN;

  useEffect(() => {
    console.log('haha');
    fetch('/api/organization/data', {
      method: 'POST',
      body: JSON.stringify({ token, organizationId }),
    })
      .then(res => res.json())
      .then(res => console.log(res));
  }, [token, organizationId]);

  return (
    <div className="bg-white min-h-screen">
      <Sidebar selectedPage={Page.ADMIN} />
      <main className="xl:pl-72 py-2">
        <div className="pl-4 pr-2 flex flex-col gap-y-3 ">
          <PeopleList />
          <IntegrationCards />
        </div>
      </main>
    </div>
  );
}
