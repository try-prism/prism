'use client';

import { useContext, useEffect, useState } from 'react';

import AdminIntegrationCards from '@/components/Admin/AdminIntegrationCards';
import AdminOverview from '@/components/Admin/AdminOverview';
import AdminSettingsTab from '@/components/Admin/AdminSettingsTab';
import AdminUserList from '@/components/Admin/AdminUserList';
import Sidebar from '@/components/Sidebar';
import { AdminSettings } from '@/constants/AdminSettings';
import { Page } from '@/constants/Navigation';
import { UserContext } from '@/contexts/UserContext';
import { Convert, Organization } from '@/models/Organization';

export default function AdminPage() {
  const { currentUser } = useContext(UserContext)!;

  const [organization, setOrganization] = useState<Organization>();
  const [currentTab, setCurrentTab] = useState<AdminSettings>(
    AdminSettings.OVERVIEW
  );

  useEffect(() => {
    const fetchOrganizationData = async () => {
      const response = await fetch(
        `/api/organization/${currentUser?.organizationId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );
      const data = await response.json();

      if (data.status !== 200) {
        console.log(data.message);
      }

      const org = Convert.toOrganization(data.organization);
      setOrganization(org);
    };

    fetchOrganizationData();
  }, [currentUser]);

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
              <AdminIntegrationCards organization={organization} />
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
