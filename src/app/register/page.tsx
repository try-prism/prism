'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEventHandler, useContext, useEffect, useState } from 'react';

import { Logo } from '@/components/Logo';
import { AlertContext, AlertType } from '@/contexts/AlertContext';
import { Whitelist } from '@/models/Whitelist';

export default function RegisterPage() {
  const setAlertMessage = useContext(AlertContext)!;
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? '';

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organizationName, setOrganizationName] = useState('');

  useEffect(() => {
    const getInvitationData = async () => {
      const response = await fetch(`/api/user/${id}/invitation`, {
        method: 'GET',
      });
      const whitelistUser: Whitelist = await response.json();
      setOrganizationName(whitelistUser.org_name);
      setEmail(whitelistUser.org_user_email);
    };

    getInvitationData();
  }, [id]);

  const registerNewUser: FormEventHandler = async event => {
    event.preventDefault();

    await fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify({
        id,
        email,
        firstName,
        lastName,
      }),
    });

    setAlertMessage({
      type: AlertType.ACTION,
      message: `Temporary password sent to ${email}`,
      duration: 3000,
    });
    router.push('/login');
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link href="/">
            <div className="mx-auto h-10 w-auto">
              <Logo />
            </div>
          </Link>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            You are invited to join{' '}
            <span className="text-purple-500">{organizationName}</span>
          </h2>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Register your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={registerNewUser}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  readOnly
                  id="email"
                  name="email"
                  type="email"
                  value={email ?? 'invalid invitation'}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="flex justify-between gap-x-3">
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    First Name
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Last Name
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-purple-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
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
