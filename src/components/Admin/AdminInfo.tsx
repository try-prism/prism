import { Organization } from '@/models/Organization';

import SummaryCard from './SummaryCard';

interface AdminInfoProps {
  organization: Organization;
}

export default function AdminInfo({ organization }: AdminInfoProps) {
  const date = new Date(Number(organization.updated_at) * 1000);
  const formattedDate = date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-3 lg:grid-cols-3 xl:gap-x-4">
      <SummaryCard
        title="Organization Info"
        data={[
          { label: 'Name', value: organization.name },
          { label: 'Contact Email', value: organization.email },
          { label: 'Admin Account', value: organization.admin_id },
        ]}
      />
      <SummaryCard
        title="Users"
        data={[
          {
            label: 'Total Users',
            value:
              organization.user_list.length +
              organization.invited_user_list.length,
          },
          { label: 'Active Users', value: organization.user_list.length },
          {
            label: 'Invited Users',
            value: organization.invited_user_list.length,
          },
        ]}
      />
      <SummaryCard
        title="Files"
        data={[
          { label: 'Total Files', value: organization.document_list.length },
          { label: 'Last Synced', value: formattedDate },
        ]}
      />
    </div>
  );
}
