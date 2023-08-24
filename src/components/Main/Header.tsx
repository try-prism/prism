import { Popover } from '@headlessui/react';
import { Bars3Icon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Button } from '@material-tailwind/react';
import { Auth } from 'aws-amplify';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';

import { NavLinks } from '@/components/Main/NavLinks';
import { UserContext } from '@/contexts/UserContext';
import PrismLogo from '@/images/prism/prism.svg';

function MobileNavLink(
  properties: Omit<
    React.ComponentPropsWithoutRef<typeof Popover.Button<typeof Link>>,
    'as' | 'className'
  >
) {
  return (
    <Popover.Button
      as={Link}
      className="block text-base leading-7 tracking-tight text-gray-900"
      {...properties}
    />
  );
}

export default function Header() {
  const { currentUser, setCurrentUser } = useContext(UserContext)!;

  const logout = () => {
    Auth.signOut();
    setCurrentUser(undefined);
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="flex items-center justify-between mx-auto max-w-7xl p-6"
        aria-label="Global"
      >
        <div className="relative z-10 flex items-center gap-16">
          <Link href="/" aria-label="Home">
            <Image className="h-10 w-auto" src={PrismLogo} alt="" />
          </Link>
          <div className="hidden lg:flex lg:gap-10">
            <NavLinks isDark />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Popover className="lg:hidden">
            {({ open }) => (
              <>
                <Popover.Button
                  className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 active:stroke-gray-900 ui-not-focus-visible:outline-none"
                  aria-label="Toggle site navigation"
                >
                  {({ open }) =>
                    open ? (
                      <ChevronUpIcon className="h-6 w-6 text-gray-900" />
                    ) : (
                      <Bars3Icon className="h-6 w-6 text-white" />
                    )
                  }
                </Popover.Button>
                <AnimatePresence initial={false}>
                  {open && (
                    <>
                      <Popover.Overlay
                        static
                        as={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-0 bg-gray-300/60 backdrop-blur"
                      />
                      <Popover.Panel
                        static
                        as={motion.div}
                        initial={{ opacity: 0, y: -32 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          y: -32,
                          transition: { duration: 0.2 },
                        }}
                        className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bg-gray-50 px-6 pb-6 pt-20 shadow-2xl shadow-gray-900/20"
                      >
                        <div className="space-y-4">
                          <MobileNavLink href="#product">Product</MobileNavLink>
                          <MobileNavLink href="#features">
                            Features
                          </MobileNavLink>
                          <MobileNavLink href="/search">
                            Dashboard
                          </MobileNavLink>
                        </div>
                        <div className="mt-8 flex flex-col gap-4">
                          {currentUser ? (
                            <button
                              className="hidden lg:block inline-flex justify-center rounded-md py-2 px-3 text-sm font-semibold outline-2 outline-offset-2 transition-colors flex-none relative overflow-hidden bg-purple-500 text-white before:absolute before:inset-0 hover:before:bg-white/10 before:transition-colors"
                              onClick={logout}
                            >
                              Log out
                            </button>
                          ) : (
                            <Link
                              href="/login"
                              className="inline-flex justify-center rounded-md py-2 px-3 text-sm font-semibold outline-2 outline-offset-2 transition-colors flex-none relative overflow-hidden bg-purple-500 text-white before:absolute before:inset-0 active:before:bg-transparent hover:before:bg-white/10 active:bg-purple-600 active:text-white/80 before:transition-colors"
                            >
                              Log in
                            </Link>
                          )}
                        </div>
                      </Popover.Panel>
                    </>
                  )}
                </AnimatePresence>
              </>
            )}
          </Popover>
          {currentUser ? (
            <Button
              className="hidden lg:block inline-flex justify-center rounded-md py-2 px-3 text-sm font-semibold outline-2 outline-offset-2 transition-colors flex-none relative overflow-hidden bg-purple-500 text-white before:absolute before:inset-0 hover:before:bg-white/10 before:transition-colors"
              onClick={logout}
            >
              Log out
            </Button>
          ) : (
            <Link
              href="/login"
              className="hidden lg:block inline-flex justify-center rounded-md py-2 px-3 text-sm font-semibold outline-2 outline-offset-2 transition-colors flex-none relative overflow-hidden bg-purple-500 text-white before:absolute before:inset-0 hover:before:bg-white/10 before:transition-colors"
            >
              Log in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
