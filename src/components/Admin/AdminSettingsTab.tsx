import clsx from 'clsx';
import { useMemo } from 'react';

import {
  AdminSettings,
  getAdminNavigationItems,
} from '@/constants/AdminSettings';

interface AdminSettingsTabProperties {
  currentTab: AdminSettings;
  setCurrentTab: (tab: AdminSettings) => void;
}

export default function AdminSettingsTab({
  currentTab,
  setCurrentTab,
}: AdminSettingsTabProperties) {
  const tabs = useMemo(() => {
    return getAdminNavigationItems(currentTab);
  }, [currentTab]);

  return (
    <div className="border-b border-gray-200">
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Admin Dashboard
      </h3>
      <div className="mt-3 sm:mt-4">
        <div className="sm:hidden">
          <label htmlFor="current-tab" className="sr-only">
            Select a tab
          </label>
          <select
            id="current-tab"
            name="current-tab"
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
            defaultValue={tabs.find(tab => tab.current)?.name}
            onChange={error_ =>
              setCurrentTab(error_.target.value as AdminSettings)
            }
          >
            {tabs.map(tab => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.name}
                className={clsx(
                  tab.current
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium'
                )}
                onClick={() => setCurrentTab(tab.name as AdminSettings)}
                aria-current={tab.current ? 'page' : undefined}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
