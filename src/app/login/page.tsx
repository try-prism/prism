'use client';
import { CognitoUser } from '@aws-amplify/auth';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Auth } from 'aws-amplify';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEventHandler, useContext, useState } from 'react';

import { Logo } from '@/components/Logo';
import { AlertContext, AlertType } from '@/contexts/AlertContext';
import { UserContext } from '@/contexts/UserContext';

interface PasswordRequirement {
  description: string;
  isPasswordValid: (newPassword: string, confirmPassword?: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    description: 'Minimum of 8 characters',
    isPasswordValid: (pw: string) => pw.length >= 8,
  },
  {
    description: 'Contains at least 1 number',
    isPasswordValid: (pw: string) => {
      const numberRegex = /\d/;
      return numberRegex.test(pw);
    },
  },
  {
    description: 'Contains at least 1 special character',
    isPasswordValid: (pw: string) => {
      const specialCharRegex = /[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~-]/;
      const spaceRegex = /^\S[\d\sA-Za-z]*\s[\d\sA-Za-z]*\S$/;
      return specialCharRegex.test(pw) || spaceRegex.test(pw);
    },
  },
  {
    description: 'Contains at least 1 uppercase letter',
    isPasswordValid: (pw: string) => {
      const uppercaseRegex = /[A-Z]/;
      return uppercaseRegex.test(pw);
    },
  },
  {
    description: 'Contains at least 1 lowercase letter',
    isPasswordValid: (pw: string) => {
      const lowercaseRegex = /[a-z]/;
      return lowercaseRegex.test(pw);
    },
  },
  {
    description: 'New password matches confirm password',
    isPasswordValid: (newPw: string, confirmPw?: string) => newPw === confirmPw,
  },
];

const isPasswordValid = (newPassword: string, confirmPassword: string) => {
  return (
    passwordRequirements.filter(
      request => !request.isPasswordValid(newPassword, confirmPassword)
    ).length === 0
  );
};

export default function LoginPage() {
  const { setCurrentUser } = useContext(UserContext)!;
  const setAlertMessage = useContext(AlertContext)!;
  const router = useRouter();

  const [user, setUser] = useState<CognitoUser>();

  // For login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // For changing an initial, temporary password.
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState('');

  const login: FormEventHandler = async event => {
    event.preventDefault();

    try {
      const currentUser = await Auth.signIn(email, password);
      setUser(currentUser);
      if (currentUser.challengeName === 'NEW_PASSWORD_REQUIRED') {
        setChangingPassword(true);
      } else {
        Auth.currentAuthenticatedUser().then(newUser => {
          const {
            email,
            'custom:user_id': userId,
            'custom:organization_id': organizationId,
            given_name,
            family_name,
          } = newUser.attributes;
          setCurrentUser({
            email,
            name: `${given_name} ${family_name}`,
            userId,
            organizationId,
            token: newUser.signInUserSession.idToken.jwtToken,
          });
          router.push('/search');
        });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setAlertMessage({
        type: AlertType.ERROR,
        message: 'Wrong email or password',
        duration: 3000,
      });
    }
  };

  const changePassword: FormEventHandler = async event => {
    event.preventDefault();

    if (newPassword === confirmPassword) {
      try {
        await Auth.completeNewPassword(user, newPassword);
        setPassword('');
        setChangingPassword(false);
        setAlertMessage({
          type: AlertType.ACTION,
          message: 'Successfully changed password.',
          duration: 3000,
        });
      } catch {
        console.log('Password change failed.');
      }
    } else {
      setError('Passwords do not match');
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link href="/">
          <div className="mx-auto h-10 w-auto">
            <Logo />
          </div>
        </Link>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          {changingPassword ? 'Change password' : 'Log in to your account'}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {changingPassword ? (
          <form className="space-y-6" onSubmit={changePassword}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-white"
              >
                New Password
              </label>
              <div className="mt-2">
                <input
                  onChange={error_ => setNewPassword(error_.target.value)}
                  type="password"
                  value={newPassword}
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-white"
              >
                Confirm Password
              </label>
              <span className="text-red-50">{error}</span>
              <div className="mt-2">
                <input
                  onChange={error_ => setConfirmPassword(error_.target.value)}
                  type="password"
                  value={confirmPassword}
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="rounded-md bg-main-black p-4 text-white">
              <ul>
                {passwordRequirements.map(requirement => (
                  <li
                    key={requirement.description}
                    className="flex items-center"
                  >
                    <div className="flex-shrink-0">
                      <CheckCircleIcon
                        className={clsx(
                          newPassword
                            ? clsx(
                                requirement.isPasswordValid(
                                  newPassword,
                                  confirmPassword
                                )
                                  ? 'text-green-400'
                                  : 'text-red-400'
                              )
                            : 'text-gray-800',
                          'h-4 w-4'
                        )}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="ml-2 text-sm text-white/40">
                      {requirement.description}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex"></div>
            </div>
            <div>
              <button
                type="submit"
                disabled={!isPasswordValid(newPassword, confirmPassword)}
                className={clsx(
                  isPasswordValid(newPassword, confirmPassword)
                    ? 'bg-purple-500 hover:bg-purple-700'
                    : 'bg-gray-600',
                  'flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600'
                )}
              >
                Set password
              </button>
            </div>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={login}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-white"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  onChange={error_ => setEmail(error_.target.value)}
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-white"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  onChange={error_ => setPassword(error_.target.value)}
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-purple-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              >
                Log In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
