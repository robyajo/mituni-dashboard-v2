"use client";
import React, { useState } from "react";

import {
  Tabs,
  TabsList,
  TabsTab,
  TabsPanels,
  TabsPanel,
} from "@/components/animate-ui/components/base/tabs";
import { KeyRound, LayoutDashboard, UserCog } from "lucide-react";
import ViewProfile from "./view-profile";
import FormProfile from "./form-profile";
import FormPassword from "./form-password";
export default function VPageAccount() {
  const [activeTab, setActiveTab] = useState("overview");
  return (
    <div>
      <div className="bg-background rounded-lg border p-6">
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
          orientation="vertical"
        >
          <TabsList className="mb-6">
            <TabsTab value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Ringkasan
            </TabsTab>
            <TabsTab value="profile" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              Edit Profil
            </TabsTab>
            <TabsTab value="password" className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              Keamanan
            </TabsTab>
          </TabsList>
          <TabsPanels>
            <TabsPanel value="overview" className="p-1">
              <ViewProfile onEdit={() => setActiveTab("profile")} />
            </TabsPanel>
            <TabsPanel value="profile" className="p-1">
              <FormProfile />
            </TabsPanel>
            <TabsPanel value="password" className="p-1">
              <FormPassword />
            </TabsPanel>
          </TabsPanels>
        </Tabs>
      </div>
    </div>
  );
}
