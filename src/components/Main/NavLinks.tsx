'use client';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState } from 'react';

interface NavLinksProps {
  isDark?: boolean;
}

export function NavLinks({ isDark }: NavLinksProps) {
  let [hoveredIndex, setHoveredIndex] = useState<number>();
  let timeoutRef = useRef<number | null>(null);

  return [
    ['Product', '#product'],
    ['Features', '#features'],
    ['Dashboard', '/search'],
  ].map(([label, href], index) => (
    <Link
      key={label}
      href={href}
      className={clsx(
        'relative -mx-3 -my-2 rounded-lg px-3 py-2 text-sm transition-colors delay-150 hover:text-gray-900 hover:delay-0',
        isDark ? 'text-white' : 'text-gray-700'
      )}
      onMouseEnter={() => {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
        setHoveredIndex(index);
      }}
      onMouseLeave={() => {
        timeoutRef.current = window.setTimeout(() => {
          setHoveredIndex(999);
        }, 200);
      }}
    >
      <AnimatePresence>
        {hoveredIndex === index && (
          <motion.span
            className="absolute inset-0 rounded-lg bg-gray-100"
            layoutId="hoverBackground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.15 } }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15 },
            }}
          />
        )}
      </AnimatePresence>
      <span className="relative z-10">{label}</span>
    </Link>
  ));
}
