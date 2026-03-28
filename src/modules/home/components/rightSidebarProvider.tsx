"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

// ─── Context ──────────────────────────────────────────────────────────────────

type RightSidebarContextProps = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const RightSidebarContext = createContext<RightSidebarContextProps | null>(null);

export function useRightSidebar() {
  const ctx = useContext(RightSidebarContext);
  if (!ctx) throw new Error("useRightSidebar must be used within <RightSidebarProvider>");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function RightSidebarProvider({
  children,
  defaultOpen = false,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return (
    <RightSidebarContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </RightSidebarContext.Provider>
  );
}
