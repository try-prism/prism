'use client';
import IntegrationCards from '@/components/IntegrationCards';
import PeopleList from '@/components/PeopleList';
import Sidebar from '@/components/Sidebar';

export default function Example() {
  return (
    <div className="bg-white min-h-screen">
      <Sidebar />
      <main className="xl:pl-72 py-2">
        <div className="pl-4 pr-2 flex flex-col gap-y-3 ">
          <PeopleList />
          <IntegrationCards />
        </div>
      </main>
    </div>
  );
}
