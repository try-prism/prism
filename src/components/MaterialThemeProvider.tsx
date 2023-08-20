'use client';
import { ThemeProvider } from '@material-tailwind/react';

export default function MaterialThemeProvider({
  children,
}: React.PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
