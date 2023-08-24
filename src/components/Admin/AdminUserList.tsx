import clsx from 'clsx';
import { useContext, useEffect, useRef, useState } from 'react';

import UserInviteModal from './UserInviteModal';
import Notification from '../Common/Notification';

import { UserContext } from '@/contexts/UserContext';
import { Organization } from '@/models/Organization';
import { Convert, User } from '@/models/User';
import { timestampToDate, timestampToDateDay } from '@/utils';

interface AdminUserListProperties {
  organization: Organization;
}

export default function AdminUserList({
  organization,
}: AdminUserListProperties) {
  const { currentUser } = useContext(UserContext)!;
  const inputReference = useRef<HTMLInputElement>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<User[]>([]);
  const [showUserInviteModal, setShowUserInviteModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputReference.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
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
  }, [currentUser, organization.user_list]);

  const addUser = async (userEmail: string) => {
    const response = await fetch(
      `/api/organization/${organization.id}/invite`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
        body: JSON.stringify({
          organizationName: organization.name,
          organizationUserEmail: userEmail,
          organizationAdminId: currentUser?.userId,
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
      body: JSON.stringify({
        token: currentUser?.token,
        organizationAdminId: currentUser?.userId,
      }),
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

      <div className="sm:flex sm:items-center pt-2">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Users
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your organization including their name
            and email.
          </p>
        </div>
        <div className="relative flex">
          <input
            ref={inputReference}
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
          />
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
              ⌘K
            </kbd>
          </div>
        </div>
        <div className="mt-4 sm:ml-5 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setShowUserInviteModal(true)}
            className="block rounded-md bg-purple-600 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            Add user
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="relative">
              {selectedPeople.length > 0 && (
                <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12">
                  <button
                    type="button"
                    onClick={async () => {
                      for (const u of users) {
                        await removeUser(u.id);
                      }
                    }}
                    className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                  >
                    Delete all
                  </button>
                </div>
              )}
              <table className="min-w-full table-fixed divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                      <input className="absolute left-4 top-1/2 -mt-2 h-4 w-4 hidden" />
                    </th>
                    <th
                      scope="col"
                      className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Added
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Last Updated
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map(user => (
                    <tr
                      key={user.id}
                      className={
                        selectedPeople.includes(user) ? 'bg-gray-50' : undefined
                      }
                    >
                      <td className="relative px-7 sm:w-12 sm:px-6">
                        {selectedPeople.includes(user) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-purple-600" />
                        )}
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                          value={user.email}
                          checked={selectedPeople.includes(user)}
                          onChange={error_ =>
                            setSelectedPeople(
                              error_.target.checked
                                ? [...selectedPeople, user]
                                : selectedPeople.filter(p => p !== user)
                            )
                          }
                        />
                      </td>
                      <td
                        className={clsx(
                          'whitespace-nowrap py-4 pr-3 text-sm font-medium',
                          selectedPeople.includes(user)
                            ? 'text-purple-600'
                            : 'text-gray-900'
                        )}
                      >
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {timestampToDateDay(user.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {timestampToDate(user.updated_at)}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                        <button className="text-purple-600 hover:text-purple-900">
                          Edit<span className="sr-only">, {user.name}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
