import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { NavLinks } from '@/components/Main/NavLinks';
import qrCode from '@/images/prism/qr-code.svg';

import { Logo } from '../Logo';

function QrCodeBorder(properties: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden="true" {...properties}>
      <path
        d="M1 17V9a8 8 0 0 1 8-8h8M95 17V9a8 8 0 0 0-8-8h-8M1 79v8a8 8 0 0 0 8 8h8M95 79v8a8 8 0 0 1-8 8h-8"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-y-12 pb-6 pt-16 lg:flex-row lg:items-center lg:py-16">
          <div>
            <div className="flex items-center text-gray-900">
              <div className="flex-none fill-purple-500 text-black">
                <Logo isBlack />
              </div>
              <div className="ml-4">
                <p className="text-base font-semibold">Prism AI</p>
                <p className="mt-1 text-sm">AI-driven Knowledge Management</p>
              </div>
            </div>
            <nav className="mt-11 flex gap-8">
              <NavLinks />
            </nav>
          </div>
          <div className="group relative -mx-4 flex items-center self-stretch p-4 transition-colors hover:bg-gray-100 sm:self-auto sm:rounded-2xl lg:mx-0 lg:self-auto lg:p-6">
            <div className="relative flex h-24 w-24 flex-none items-center justify-center">
              <QrCodeBorder className="absolute inset-0 h-full w-full stroke-gray-300 transition-colors group-hover:stroke-purple-500" />
              <Image src={qrCode} alt="" unoptimized />
            </div>
            <div className="ml-8 lg:w-64">
              <p className="text-base font-semibold text-gray-900">
                <Link
                  href="https://www.linkedin.com/company/tryprism/"
                  target="_blank"
                >
                  <span className="absolute inset-0 sm:rounded-2xl" />
                  Follow our LinkedIn
                </Link>
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Scan the QR code to open our LinkedIn profile.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center border-t border-gray-200 pb-12 pt-8 md:flex-row-reverse md:justify-between md:pt-6">
          <form className="flex w-full justify-center md:w-auto">
            <div className="w-60 min-w-0 shrink">
              <input
                type="text"
                aria-label="Email address"
                placeholder="Email address"
                autoComplete="email"
                required
                className="block w-full appearance-none rounded-lg border border-gray-200 bg-white py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              color="purple"
              className="inline-flex justify-center rounded-md py-2 px-3 text-sm font-semibold outline-2 outline-offset-2 transition-colors ml-4 flex-none relative overflow-hidden bg-purple-500 text-white before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-purple-600 active:text-white/80 before:transition-colors"
            >
              <span className="hidden lg:inline">Join our newsletter</span>
              <span className="lg:hidden">Join newsletter</span>
            </button>
          </form>
          <p className="mt-6 text-sm text-gray-500 md:mt-0">
            &copy; Copyright {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
