export enum AdminSettings {
  OVERVIEW = 'Overview',
  USERS = 'Users',
  BILLING = 'Billing',
  INTEGRATIONS = 'Integrations',
}

export interface AdminNavigationElementProps {
  name: string;
  current: boolean;
}

export const getAdminNavigationItems = (
  selected: AdminSettings
): AdminNavigationElementProps[] => [
  {
    name: AdminSettings.OVERVIEW,
    current: selected === AdminSettings.OVERVIEW,
  },
  {
    name: AdminSettings.USERS,
    current: selected === AdminSettings.USERS,
  },
  {
    name: AdminSettings.BILLING,
    current: selected === AdminSettings.BILLING,
  },
  {
    name: AdminSettings.INTEGRATIONS,
    current: selected === AdminSettings.INTEGRATIONS,
  },
];
