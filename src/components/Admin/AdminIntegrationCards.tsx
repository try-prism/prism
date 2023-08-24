import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { useMergeLink } from '@mergeapi/react-merge-link';
import clsx from 'clsx';
import Image from 'next/image';
import { Fragment, useCallback, useContext, useEffect, useState } from 'react';

import StatusBadge from './StatusBadge';
import Notification from '../Common/Notification';

import { INTEGRATION_LOGO_MAPPINGS } from '@/constant';
import { UserContext } from '@/contexts/UserContext';
import { IntegrationData, Organization } from '@/models/Organization';
import { timestampToDate } from '@/utils';

interface AdminIntegrationCardsProperties {
  organization: Organization;
}

export default function AdminIntegrationCards({
  organization,
}: AdminIntegrationCardsProperties) {
  const { currentUser } = useContext(UserContext)!;
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

  useEffect(() => {
    setIntegrations(Object.values(organization.link_id_map));
  }, [organization.link_id_map]);

  useEffect(() => {
    const fetchLinkToken = async () => {
      const response = await fetch(
        `/api/integration/${organization.id}/generate`,
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

      setLinkToken(data.link_token);
    };

    fetchLinkToken();
  }, [currentUser, organization.id]);

  const removeIntegration = async (accountToken: string) => {
    const response = await fetch(`/api/integration/${organization.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${currentUser?.token}`,
      },
      body: JSON.stringify({
        accountToken,
        organizationAdminId: currentUser?.userId,
      }),
    });
    const data = await response.json();
    console.log(data);

    if (data.status === 200) {
      setShowRemoveSuccessNotification(true);
      setIntegrations(
        integrations.filter(
          integration => integration.account_token !== accountToken
        )
      );
    } else {
      setShowRemoveErrorNotification(true);
    }
  };

  const onSuccess = useCallback(
    async (public_token: string) => {
      const response = await fetch('/api/integration', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
        body: JSON.stringify({
          publicToken: public_token,
          organizationId: organization.id,
          organizationName: organization.name,
          organizationAdminId: currentUser?.userId,
        }),
      });
      const data = await response.json();
      console.log(data);

      const integrationItem = data.integration_item;

      if (data.status === 200) {
        setShowAddSuccessNotification(true);
        setIntegrations(integrations => [
          ...integrations,
          {
            created: integrationItem.created,
            integration: integrationItem.integration,
            end_user_organization_name:
              integrationItem.end_user_organization_name,
            end_user_email_address: integrationItem.end_user_email_address,
            id: integrationItem.id,
            category: integrationItem.category,
            is_duplicate: integrationItem.is_duplicate,
            end_user_origin_id: integrationItem.end_user_origin_id,
            integration_slug: integrationItem.integration_slug,
            status: integrationItem.status,
            webhook_listener_url: integrationItem.webhook_listener_url,
            account_id: integrationItem.account_id,
            account_token: integrationItem.account_token,
          },
        ]);
      } else {
        setShowAddErrorNotification(true);
      }
    },
    [organization.id, organization.name, currentUser]
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
      <div className="sm:flex sm:items-center pt-2">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Integrations
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all of the integrations your organization linked.
          </p>
        </div>
        <div className="mt-4 sm:ml-5 sm:mt-0 sm:flex-none">
          <button
            type="button"
            disabled={!isReady}
            onClick={open}
            className="block rounded-md bg-purple-600 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            Add Integration
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <ul className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3">
              {integrations.map(integration => (
                <li
                  key={integration.id}
                  className="overflow-hidden rounded-xl border border-gray-200"
                >
                  <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-3">
                    <Image
                      src={
                        INTEGRATION_LOGO_MAPPINGS[integration.integration_slug]
                      }
                      alt={integration.integration_slug}
                      className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10 p-1"
                    />
                    <div className="text-sm font-medium leading-6 text-gray-900">
                      {integration.integration}
                    </div>
                    <Menu as="div" className="relative ml-auto">
                      <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-600">
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
                                  await removeIntegration(
                                    integration.account_token
                                  )
                                }
                                className={clsx(
                                  active ? 'bg-gray-50' : '',
                                  'block px-5 py-1 text-sm leading-6 text-gray-900 w-full text-right'
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
                      <dt className="text-gray-600">Account</dt>
                      <dd className="text-gray-900">
                        {integration.account_id}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-x-4 py-2">
                      <dt className="text-gray-600">Added Date</dt>
                      <dd className="flex items-start gap-x-2 text-gray-900">
                        {timestampToDate(integration.created)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-x-4 py-2">
                      <dt className="text-gray-600">Status</dt>
                      <StatusBadge status={integration.status} />
                    </div>
                    <div className="flex justify-between gap-x-4 py-2">
                      <dt className="text-gray-600">Category</dt>
                      <dd className="text-gray-900">{integration.category}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
