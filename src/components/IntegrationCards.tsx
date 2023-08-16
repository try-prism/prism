import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { useMergeLink } from '@mergeapi/react-merge-link';
import axios from 'axios';
import clsx from 'clsx';
import Image from 'next/image';
import { Fragment, useCallback, useEffect, useState } from 'react';

// import ShareDriveLogo from '@/images/integrations/sharedrive.png';
// import DropboxLogo from '@/images/integrations/dropbox.png';
import { API_BASE_URL } from '@/constant';
import BoxLogo from '@/images/integrations/box.png';
import GoogleDriveLogo from '@/images/integrations/googledrive.png';
import OneDriveLogo from '@/images/integrations/onedrive.png';

const integrations = [
  {
    id: 1,
    name: 'Google Drive',
    src: GoogleDriveLogo,
    account: 'corp-admin@google.com',
    date: '2022-12-13',
    status: 'Complete',
    category: 'File Storage',
  },
  {
    id: 2,
    name: 'Box',
    src: BoxLogo,
    account: 'corp-admin@microsoft.com',
    date: '2022-12-13',
    status: 'Complete',
    category: 'File Storage',
  },
  {
    id: 3,
    name: 'OneDrive',
    src: OneDriveLogo,
    account: 'corp-admin@apple.com',
    date: '2022-12-13',
    status: 'Complete',
    category: 'File Storage',
  },
];

export default function IntegrationCards() {
  const [linkToken, setLinkToken] = useState<string>('');
  const [orgId, setOrgId] = useState<string>('');
  const [orgName, setOrgName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    setLinkToken('');
    setOrgId('');
    setOrgName('');
    setEmail('');
  }, []);

  // useEffect(() => {
  //   axios.get(`${API_BASE_URL}/integration/what/generate`).then(({ data }) => {
  //     setLinkToken(data.linkToken);
  //   });
  // }, []);

  const onSuccess = useCallback(
    (public_token: string) => {
      axios.post(`${API_BASE_URL}/integration`, {
        public_token,
        organization_id: orgId,
        organization_name: orgName,
        email_address: email,
      });
    },
    [orgId, orgName, email]
  );

  const { open, isReady } = useMergeLink({
    linkToken,
    onSuccess,
    // tenantConfig: {
    // apiBaseURL: "https://api-eu.merge.dev" /* OR your specified single tenant API base URL */
    // },
  });

  return (
    <div className="shadow-md border border-main-black/10 rounded-2xl px-3 pb-3">
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
            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
              <Image
                src={integration.src}
                alt={integration.name}
                className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10 p-1"
              />
              <div className="text-sm font-medium leading-6 text-gray-900">
                {integration.name}
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
                        <a
                          href="#"
                          className={clsx(
                            active ? 'bg-gray-50' : '',
                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                          )}
                        >
                          Remove
                          <span className="sr-only">, {integration.name}</span>
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-2">
                <dt className="text-gray-500">Account</dt>
                <dd className="text-gray-700">{integration.account}</dd>
              </div>
              <div className="flex justify-between gap-x-4 py-2">
                <dt className="text-gray-500">Added Date</dt>
                <dd className="flex items-start gap-x-2 text-gray-700">
                  <time dateTime={integration.date}>{integration.date}</time>
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
  );
}
