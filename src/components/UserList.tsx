import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';

import { TEST_ADMIN_ID, TEST_TOKEN } from '@/constant';
import { Organization } from '@/models/Organization';
import { Convert, User } from '@/models/User';
import { timestampToDate, timestampToDateDay } from '@/utils';

import UserInviteModal from './Admin/UserInviteModal';
import Notification from './Common/Notification';

interface UserListsProps {
  organization: Organization;
}

export default function UserList({ organization }: UserListsProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [showUserInviteModal, setShowUserInviteModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const token = TEST_TOKEN;
  const organizationAdminId = TEST_ADMIN_ID;

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userIds: organization.user_list }),
      });
      const data = await response.json();

      if (data.status !== 200) {
        console.log(data.message);
      }

      const cleanedUsers = data.users.map((user: any) => Convert.toUser(user));

      setUsers(cleanedUsers);
    };

    fetchUserData();
  }, [token, organization.user_list]);

  const addUser = async (userEmail: string) => {
    const response = await fetch(
      `/api/organization/${organization.id}/invite`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          organizationName: organization.name,
          organizationUserEmail: userEmail,
          organizationAdminId,
        }),
      }
    );
    const data = await response.json();

    if (data.status === 200) {
      const timestamp = Date.now().toString();
      setShowSuccessNotification(true);
      setUsers((users: User[]) => [
        ...users,
        {
          id: userEmail,
          email: userEmail,
          name: userEmail,
          organization_id: organization.id,
          created_at: timestampToDate(timestamp),
          updated_at: timestampToDateDay(timestamp),
        },
      ]);
      organization.invited_user_list.push(userEmail);
    } else {
      console.log(data);
      setShowErrorNotification(true);
    }
  };

  const removeUser = async (userId: string) => {
    const response = await fetch(`/api/user/${userId}`, {
      method: 'DELETE',
      body: JSON.stringify({ token, organizationAdminId }),
    });
    const data = await response.json();

    if (data.status === 200) {
      setShowSuccessNotification(true);
      setUsers((users: User[]) =>
        users.filter((user: User) => user.id !== userId)
      );
      organization.invited_user_list = organization.user_list.filter(
        user => user !== userId
      );
    } else {
      console.log(data);
      setShowErrorNotification(true);
    }
  };

  return (
    <>
      <UserInviteModal
        showUserInviteModal={showUserInviteModal}
        setShowUserInviteModal={setShowUserInviteModal}
        addUser={addUser}
      />
      <Notification
        title="Success"
        description="Sucessfully performed the operation"
        isError={false}
        show={showSuccessNotification}
        setShow={setShowSuccessNotification}
      />
      <Notification
        title="Error"
        description="Please try again later"
        isError
        show={showErrorNotification}
        setShow={setShowErrorNotification}
      />
      <div className="shadow border border-main-black/10 rounded-2xl px-5 py-4">
        <div className="border-b border-gray-200 bg-white mx-4 pb-5">
          <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Users
              </h3>
            </div>
            <div className="ml-4 mt-2 flex-shrink-0">
              <button
                type="button"
                className="relative inline-flex items-center rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                onClick={() => setShowUserInviteModal(true)}
              >
                Invite
              </button>
            </div>
          </div>
        </div>
        <ul className="divide-y divide-gray-100 px-4">
          {users.map(user => (
            <li key={user.email} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                {/* <Image
                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                src={user.src}
                alt=""
              /> */}
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    <Link href="#" className="hover:underline">
                      {user.name}
                    </Link>
                  </p>
                  <p className="mt-1 flex text-xs leading-5 text-gray-600">
                    <Link
                      href={`mailto:${user.email}`}
                      className="truncate hover:underline"
                    >
                      {user.email}
                    </Link>
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-6">
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm leading-6 text-gray-900">
                    Added on {timestampToDateDay(user.created_at)}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-600">
                    Last updated: {timestampToDate(user.updated_at)}
                  </p>
                </div>
                <Menu as="div" className="relative flex-none">
                  <Menu.Button className="-m-2.5 block p-2.5 text-gray-600 hover:text-gray-900">
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="#"
                            className={clsx(
                              active ? 'bg-gray-50' : '',
                              'block px-3 py-1 text-sm leading-6 text-gray-900'
                            )}
                          >
                            Edit Profile
                            <span className="sr-only">, {user.name}</span>
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={async () => removeUser(user.id)}
                            className={clsx(
                              active ? 'bg-gray-50' : '',
                              'block px-3 py-1 text-sm leading-6 text-gray-900'
                            )}
                          >
                            Remove
                            <span className="sr-only">, {user.name}</span>
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
