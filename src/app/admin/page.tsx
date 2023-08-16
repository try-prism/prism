'use client';

import IntegrationCards from '@/components/IntegrationCards';
import PeopleList from '@/components/PeopleList';
import Sidebar from '@/components/Sidebar';
import { Page } from '@/constants/Navigation';

export default function AdminPage() {
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
