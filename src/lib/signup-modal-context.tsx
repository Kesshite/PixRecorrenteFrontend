"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface SignupModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const SignupModalContext = createContext<SignupModalContextType>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export function SignupModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <SignupModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </SignupModalContext.Provider>
  );
}

export function useSignupModal() {
  return useContext(SignupModalContext);
}
