'use client';

import { useEffect, useState } from 'react';

import AdminOverview from '@/components/Admin/AdminOverview';
import AdminSettingsTab from '@/components/Admin/AdminSettingsTab';
import AdminUserList from '@/components/Admin/AdminUserList';
import IntegrationCards from '@/components/Admin/IntegrationCards';
import Sidebar from '@/components/Sidebar';
import UserList from '@/components/UserList';
import { TEST_ORG_ID, TEST_TOKEN } from '@/constant';
import { AdminSettings } from '@/constants/AdminSettings';
import { Page } from '@/constants/Navigation';
import { Convert, Organization } from '@/models/Organization';

export default function AdminPage() {
  const [organization, setOrganization] = useState<Organization>();
  const [currentTab, setCurrentTab] = useState<AdminSettings>(
    AdminSettings.OVERVIEW
  );
  const organizationId = TEST_ORG_ID;
  const token = TEST_TOKEN;

  useEffect(() => {
    const fetchOrganizationData = async () => {
      const response = await fetch(`/api/organization/${organizationId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
          <div className="pl-4 pr-2 flex flex-col gap-y-3 mt-5 mx-5">
            <AdminSettingsTab
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />
            {currentTab === AdminSettings.OVERVIEW && (
              <AdminOverview organization={organization} />
            )}
            {currentTab === AdminSettings.INTEGRATIONS && (
              <IntegrationCards organization={organization} />
            )}
            {currentTab === AdminSettings.USERS && (
              <AdminUserList organization={organization} />
            )}
          </div>
        </main>
      )}
    </div>
  );
}
