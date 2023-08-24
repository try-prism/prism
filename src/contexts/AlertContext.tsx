'use client';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { createContext, useState } from 'react';

export enum AlertType {
  ACTION,
  ERROR,
}

interface Alert {
  type: AlertType;
  message: string;
}

export const AlertContext = createContext<
  | ((options: { type: AlertType; message: string; duration: number }) => void)
  | undefined
>(undefined);

interface AlertContextProviderProperties {
  children: React.ReactNode;
}

export default function AlertContextProvider({
  children,
}: AlertContextProviderProperties) {
  const [alert, setAlert] = useState<Alert>();

  return (
    <AlertContext.Provider
      value={(options: {
        type: AlertType;
        message: string;
        duration: number;
      }) => {
        const { type, message, duration } = options;
        setAlert({ type, message });
        setInterval(() => {
          setAlert(undefined);
        }, duration);
      }}
    >
      {children}
      {alert &&
        (alert.type === AlertType.ACTION ? (
          <div className="fixed w-max mx-auto inset-x-0 bottom-8 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <CheckCircleIcon
                  className="h-5 w-5 text-green-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {alert.message}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                    onClick={() => setAlert(undefined)}
                  >
                    <span className="sr-only">Dismiss</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="fixed w-max mx-auto inset-x-0 bottom-8 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <CheckCircleIcon
                  className="h-5 w-5 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {alert.message}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                    onClick={() => setAlert(undefined)}
                  >
                    <span className="sr-only">Dismiss</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </AlertContext.Provider>
  );
}
