import { Dialog, Transition } from '@headlessui/react';
import { EnvelopeIcon } from '@heroicons/react/20/solid';
import { Fragment, useState } from 'react';

import { validateEmail } from '@/utils';

interface UserInviteModalProperties {
  showUserInviteModal: boolean;
  setShowUserInviteModal: (showUserInviteModal: boolean) => void;
  addUser: (userEmail: string) => Promise<any>;
}

export default function UserInviteModal({
  showUserInviteModal,
  setShowUserInviteModal,
  addUser,
}: UserInviteModalProperties) {
  const [userEmail, setUserEmail] = useState<string>('');

  return (
    <Transition.Root show={showUserInviteModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={setShowUserInviteModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Invite User
                      </Dialog.Title>
                      <div className="my-5">
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Email
                          </label>
                          <div className="relative mt-2 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <EnvelopeIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </div>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              placeholder="you@example.com"
                              onChange={error_ =>
                                setUserEmail(error_.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    disabled={!validateEmail(userEmail)}
                    className="inline-flex w-full justify-center rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 sm:ml-3 sm:w-auto disabled:bg-slate-500"
                    onClick={async () => {
                      await addUser(userEmail);
                      setShowUserInviteModal(false);
                    }}
                  >
                    Invite
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => setShowUserInviteModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
