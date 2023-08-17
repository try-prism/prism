import { Organization } from '@/models/Organization';
import { timestampToDate } from '@/utils';

import SummaryCard from './SummaryCard';

interface AdminInfoProps {
  organization: Organization;
}

export default function AdminInfo({ organization }: AdminInfoProps) {
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
          {
            label: 'Last Synced',
            value: timestampToDate(organization.updated_at),
          },
        ]}
      />
    </div>
  );
}
