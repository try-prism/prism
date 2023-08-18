'use client';

import { useEffect, useState } from 'react';

import AdminInfo from '@/components/Admin/AdminInfo';
import IntegrationCards from '@/components/Admin/IntegrationCards';
import Sidebar from '@/components/Sidebar';
import UserList from '@/components/UserList';
import { TEST_ORG_ID, TEST_TOKEN } from '@/constant';
import { Page } from '@/constants/Navigation';
import { Convert, Organization } from '@/models/Organization';

export default function AdminPage() {
  const [organization, setOrganization] = useState<Organization>();
  const organizationId = TEST_ORG_ID;
  const token = TEST_TOKEN;

  useEffect(() => {
    const fetchOrganizationData = async () => {
      const response = await fetch('/api/organization/data', {
        method: 'POST',
        body: JSON.stringify({ token, organizationId }),
      });
      const data = await response.json();

      if (data.status !== 200) {
        console.log(data.message);
      }

      const org = Convert.toOrganization(data.organization);
      setOrganization(org);
    };

    fetchOrganizationData();
  }, [token, organizationId]);

  return (
    <div className="bg-white min-h-screen">
      <Sidebar selectedPage={Page.ADMIN} />
      {organization && (
        <main className="xl:pl-72 py-2">
          <div className="pl-4 pr-2 flex flex-col gap-y-3 ">
            <AdminInfo organization={organization} />
            <IntegrationCards organization={organization} />
            <UserList organization={organization} />
          </div>
        </main>
      )}
    </div>
  );
}
