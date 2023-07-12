"use client";
import { ThemeProvider } from "next-themes";

interface ThemeProvider {
    children: React.ReactNode;
}
export default function ClientThemeProvider({
  children: children,
}: ThemeProvider,): JSX.Element {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      {children}
    </ThemeProvider>
  );
}
