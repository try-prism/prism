import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { useMergeLink } from '@mergeapi/react-merge-link';
import clsx from 'clsx';
import Image from 'next/image';
import { Fragment, useCallback, useEffect, useState } from 'react';

import { INTEGRATION_LOGO_MAPPINGS, TEST_TOKEN } from '@/constant';
import { IntegrationData, Organization } from '@/models/Organization';
import { timestampToDate } from '@/utils';

import Notification from '../Common/Notification';

interface IntegrationCardsProps {
  organization: Organization;
}

export default function IntegrationCards({
  organization,
}: IntegrationCardsProps) {
  const [integrations, setIntegrations] = useState<IntegrationData[]>([]);
  const [linkToken, setLinkToken] = useState<string>('');
  const [showAddSuccessNotification, setShowAddSuccessNotification] =
    useState(false);
  const [showAddErrorNotification, setShowAddErrorNotification] =
    useState(false);
  const [showRemoveSuccessNotification, setShowRemoveSuccessNotification] =
    useState(false);
  const [showRemoveErrorNotification, setShowRemoveErrorNotification] =
    useState(false);

  const token = TEST_TOKEN;

  useEffect(() => {
    setIntegrations(Object.values(organization.link_id_map));
  }, [organization]);

  useEffect(() => {
    const fetchLinkToken = async () => {
      const response = await fetch('/api/integration/token', {
        method: 'POST',
        body: JSON.stringify({ token, organizationId: organization.id }),
      });
      const data = await response.json();

      if (data.status !== 200) {
        console.log(data.message);
      }

      setLinkToken(data.link_token);
    };

    fetchLinkToken();
  }, [token, organization]);

  const removeIntegration = async (accountToken: string) => {
    const response = await fetch('/api/integration/', {
      method: 'DELETE',
      body: JSON.stringify({
        token: token,
        organizationId: organization.id,
        accountToken,
      }),
    });
    const data = await response.json();
    console.log(data);

    if ('code' in data) {
      setShowRemoveErrorNotification(true);
    } else {
      setShowRemoveSuccessNotification(true);
    }
  };

  const onSuccess = useCallback(
    async (public_token: string) => {
      const response = await fetch('/api/integration/link', {
        method: 'POST',
        body: JSON.stringify({
          token: token,
          publicToken: public_token,
          organizationId: organization.id,
          organizationName: organization.name,
        }),
      });
      const data = await response.json();
      console.log(data);

      if ('code' in data) {
        setShowAddErrorNotification(true);
      } else {
        setShowAddSuccessNotification(true);
      }
    },
    [token, organization]
  );

  const { open, isReady } = useMergeLink({
    linkToken: linkToken,
    onSuccess,
  });

  return (
    <>
      <Notification
        title="Successfully added"
        description="Please wait for few minutes ~ hour depending on the size of your files"
        isError={false}
        show={showAddSuccessNotification}
        setShow={setShowAddSuccessNotification}
      />
      <Notification
        title="Failed to add integration"
        description="Please try again later"
        isError={true}
        show={showAddErrorNotification}
        setShow={setShowAddErrorNotification}
      />
      <Notification
        title="Success"
        description="Removed integration successfully"
        isError={false}
        show={showRemoveSuccessNotification}
        setShow={setShowRemoveSuccessNotification}
      />
      <Notification
        title="Failed to remove integration"
        description="Please try again later"
        isError={true}
        show={showRemoveErrorNotification}
        setShow={setShowRemoveErrorNotification}
      />
      <div className="shadow border border-main-black/10 rounded-2xl px-3 pb-3">
        <div className="border-gray-200 bg-white px-4 py-5 sm:px-6">
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Integrations
              </h3>
            </div>
            <div className="ml-4 mt-2 flex-shrink-0">
              <button
                type="button"
                className="relative inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                disabled={!isReady}
                onClick={open}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-4">
          {integrations.map(integration => (
            <li
              key={integration.id}
              className="overflow-hidden rounded-xl border border-gray-200"
            >
              <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-3">
                <Image
                  src={INTEGRATION_LOGO_MAPPINGS[integration.integration_slug]}
                  alt={integration.integration_slug}
                  className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10 p-1"
                />
                <div className="text-sm font-medium leading-6 text-gray-900">
                  {integration.integration}
                </div>
                <Menu as="div" className="relative ml-auto">
                  <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Open options</span>
                    <EllipsisHorizontalIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={async () =>
                              await removeIntegration(integration.id)
                            }
                            className={clsx(
                              active ? 'bg-gray-50' : '',
                              'block px-3 py-1 text-sm leading-6 text-gray-900'
                            )}
                          >
                            Remove
                            <span className="sr-only">
                              , {integration.integration}
                            </span>
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                <div className="flex justify-between gap-x-4 py-2">
                  <dt className="text-gray-500">Account</dt>
                  <dd className="text-gray-700">{integration.account_id}</dd>
                </div>
                <div className="flex justify-between gap-x-4 py-2">
                  <dt className="text-gray-500">Added Date</dt>
                  <dd className="flex items-start gap-x-2 text-gray-700">
                    {timestampToDate(integration.created)}
                  </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-2">
                  <dt className="text-gray-500">Status</dt>
                  <dd className="text-gray-700">{integration.status}</dd>
                </div>
                <div className="flex justify-between gap-x-4 py-2">
                  <dt className="text-gray-500">Category</dt>
                  <dd className="text-gray-700">{integration.category}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
