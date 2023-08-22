'use client';
import { CognitoUser } from '@aws-amplify/auth';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/navigation';
import { FormEventHandler, useContext, useState } from 'react';

import { Logo } from '@/components/Logo';
import { API_BASE_URL, TEST_TOKEN } from '@/constant';
import { AlertContext, AlertType } from '@/contexts/AlertContext';
import { UserContext } from '@/contexts/UserContext';

export default function LoginPage() {
  const token = TEST_TOKEN;
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
        const userInfo = await Auth.currentUserInfo();
        console.log('info', userInfo);
        const {
          email,
          'custom:user_id': userId,
          'custom:organization_id': organizationId,
          given_name,
          family_name,
        } = userInfo.attributes;
        setCurrentUser({
          email,
          name: `${given_name} ${family_name}`,
          userId,
          organizationId,
        });

        await fetch(`${API_BASE_URL}/user/${userId}/cookie`, {
          method: 'POST',
          headers: {
            Authorization: token,
          },
        });
        router.push('/search');
      }
    } catch (error) {
      console.error('Error logging in:', error);
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
        <div className="mx-auto h-10 w-auto">
          <Logo />
        </div>
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
                  onChange={e => setNewPassword(e.target.value)}
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
                  onChange={e => setConfirmPassword(e.target.value)}
                  type="password"
                  value={confirmPassword}
                  autoComplete="new-password"
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
                  onChange={e => setEmail(e.target.value)}
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
                  onChange={e => setPassword(e.target.value)}
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
