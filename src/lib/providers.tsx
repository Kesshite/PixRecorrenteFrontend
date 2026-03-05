"use client";

import { ThemeProvider } from "@/lib/theme-context";
import { SignupModalProvider } from "@/lib/signup-modal-context";
import { AuthProvider } from "@/lib/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SignupModalProvider>
          {children}
        </SignupModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
