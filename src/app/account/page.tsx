'use client';

import { useEffect, useState } from 'react';

import Sidebar from '@/components/Sidebar';
import { TEST_ADMIN_ID, TEST_TOKEN } from '@/constant';
import { Page } from '@/constants/Navigation';
import { Convert, User } from '@/models/User';

export default function AccountPage() {
  const [user, setUser] = useState<User>();
  const userId = TEST_ADMIN_ID;
  const token = TEST_TOKEN;

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify({ token, userId }),
      });
      const data = await response.json();

      if (data.status !== 200) {
        console.log(data.message);
      }

      const userData = Convert.toUser(data.user);
      setUser(userData);
    };

    fetchUserData();
  }, [token, userId]);

  return (
    <div className="bg-white min-h-screen">
      <Sidebar selectedPage={Page.ACCOUNT} />
      {user && (
        <main className="xl:pl-72 py-2">
          <div className="pl-4 pr-2 flex flex-col gap-y-3">
            <div className="shadow border border-main-black/10 rounded-2xl px-3 py-4">
              <div className="bg-white mx-4 pb-5">
                {/* Settings forms */}
                <div className="divide-y divide-white/5">
                  <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
                    <div>
                      <h2 className="text-base font-semibold leading-7 text-stone-900">
                        Personal Information
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-gray-400">
                        Contact organization admin to if you want to change your
                        contact information
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium leading-6 text-stone-900"
                          >
                            Name
                          </label>
                          <div className="mt-2">
                            <label
                              htmlFor="first-name"
                              className="block text-lg py-1.5 font-medium leading-6 text-stone-900"
                            >
                              {user.name}
                            </label>
                          </div>
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-stone-900"
                          >
                            Email address
                          </label>
                          <div className="mt-2">
                            <label
                              htmlFor="first-name"
                              className="block text-lg py-1.5 font-medium leading-6 text-stone-900"
                            >
                              {user.email}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                    <div>
                      <h2 className="text-base font-semibold leading-7 text-stone-900">
                        Change password
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-gray-400">
                        Update your password associated with your account.
                      </p>
                    </div>

                    <form className="md:col-span-2">
                      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                        <div className="col-span-full">
                          <label
                            htmlFor="current-password"
                            className="block text-sm font-medium leading-6 text-stone-900"
                          >
                            Current password
                          </label>
                          <div className="mt-2">
                            <input
                              id="current-password"
                              name="current_password"
                              type="password"
                              autoComplete="current-password"
                              className="block w-full rounded-md border border-gray-300 bg-white/5 py-1.5 text-stone-900 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="new-password"
                            className="block text-sm font-medium leading-6 text-stone-900"
                          >
                            New password
                          </label>
                          <div className="mt-2">
                            <input
                              id="new-password"
                              name="new_password"
                              type="password"
                              autoComplete="new-password"
                              className="block w-full rounded-md border border-gray-300 bg-white/5 py-1.5 text-stone-900 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="confirm-password"
                            className="block text-sm font-medium leading-6 text-stone-900"
                          >
                            Confirm password
                          </label>
                          <div className="mt-2">
                            <input
                              id="confirm-password"
                              name="confirm_password"
                              type="password"
                              autoComplete="new-password"
                              className="block w-full rounded-md border border-gray-300 bg-white/5 py-1.5 text-stone-900 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex">
                        <button
                          type="submit"
                          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                    <div>
                      <h2 className="text-base font-semibold leading-7 text-stone-900">
                        Log out other sessions
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-gray-400">
                        Please enter your password to confirm you would like to
                        log out of your other sessions across all of your
                        devices.
                      </p>
                    </div>

                    <form className="md:col-span-2">
                      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                        <div className="col-span-full">
                          <label
                            htmlFor="logout-password"
                            className="block text-sm font-medium leading-6 text-stone-900"
                          >
                            Your password
                          </label>
                          <div className="mt-2">
                            <input
                              id="logout-password"
                              name="password"
                              type="password"
                              autoComplete="current-password"
                              className="block w-full rounded-md border border-gray-300 bg-white/5 py-1.5 text-stone-900 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex">
                        <button
                          type="submit"
                          className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
                        >
                          Log out other sessions
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
