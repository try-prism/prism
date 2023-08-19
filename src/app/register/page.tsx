'use client';
import { Logo } from '@/components/Logo';
import { FormEventHandler, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { API_BASE_URL } from '@/constant';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? 'missing id';

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const registerNewUser: FormEventHandler = event => {
    event.preventDefault();

    axios.post(`${API_BASE_URL}/user`, {
      id,
      email,
      first_name: firstName,
      last_name: lastName,
    });
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="mx-auto h-10 w-auto">
            <Logo />
          </div>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Register your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={registerNewUser}>
            <div>
              <label
                htmlFor="what"
                className="block text-sm font-medium leading-6 text-white"
              >
                User Id
              </label>
              <div className="mt-2">
                <input
                  id="userId"
                  name="userId"
                  value={id}
                  type="userId"
                  readOnly
                  disabled
                  className="block w-full px-2 rounded-md border-0 py-1.5 text-blue shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-blue-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  onChange={e => setEmail(e.target.value)}
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-main-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <label
                  htmlFor="first name"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-main-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="last name"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-main-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
