"use client";

import React, { createContext, useContext } from "react";
import type { DashboardData } from "@/lib/dashboard-data";

const DashboardContext = createContext<DashboardData | null>(null);

export function DashboardDataProvider({
  data,
  children,
}: {
  data: DashboardData;
  children: React.ReactNode;
}) {
  return <DashboardContext.Provider value={data}>{children}</DashboardContext.Provider>;
}

export function useDashboard(): DashboardData {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardDataProvider");
  return ctx;
}
