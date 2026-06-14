"use client";

import React, { useState } from "react";
import { RenoDashboardShell, type RenoTab } from "./reno-dashboard-shell";
import {
  RenoOverview,
  RenoProgress,
  RenoRooms,
  RenoAvvik,
  RenoMaterials,
  RenoBudget,
  RenoDocuments,
  RenoPhotos,
  RenoMessages,
  RenoMeetings,
  RenoSettings,
} from "./reno-tabs";

export function RenoDashboardPage() {
  const [tab, setTab] = useState<RenoTab>("oversikt");

  const content = () => {
    switch (tab) {
      case "oversikt":     return <RenoOverview onNav={setTab} />;
      case "fremdrift":    return <RenoProgress />;
      case "rom":          return <RenoRooms />;
      case "avvik":        return <RenoAvvik onNav={setTab} />;
      case "materialer":   return <RenoMaterials />;
      case "okonomi":      return <RenoBudget onNav={setTab} />;
      case "dokumenter":   return <RenoDocuments />;
      case "meldinger":    return <RenoMessages />;
      case "bildelogg":    return <RenoPhotos />;
      case "moter":        return <RenoMeetings />;
      case "innstillinger":return <RenoSettings />;
      default:             return <RenoOverview onNav={setTab} />;
    }
  };

  return (
    <RenoDashboardShell tab={tab} onTabChange={setTab}>
      {content()}
    </RenoDashboardShell>
  );
}
