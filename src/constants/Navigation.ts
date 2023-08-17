import {
  Bars3BottomLeftIcon,
  BuildingOffice2Icon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export interface NavigationElementProps {
  name: string;
  href: string;
  icon: any;
  current: boolean;
}

export enum Page {
  SEARCH,
  HISTORY,
  ADMIN,
  ACCOUNT,
}

export const getNavigationItems = (
  selected: Page
): NavigationElementProps[] => [
  {
    name: 'Search',
    href: '/search',
    icon: MagnifyingGlassIcon,
    current: selected === Page.SEARCH,
  },
  {
    name: 'My History',
    href: '#',
    icon: Bars3BottomLeftIcon,
    current: selected === Page.HISTORY,
  },
  {
    name: 'Admin Dashboard',
    href: '/admin',
    icon: BuildingOffice2Icon,
    current: selected === Page.ADMIN,
  },
];
