'use client';

import { ThemeProvider } from '@material-tailwind/react';
import React from 'react';

export default function MaterialThemeProvider({
  children,
}: React.PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
