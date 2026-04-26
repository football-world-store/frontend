"use client";

import { SettingsTemplate } from "@/components/templates";
import { useAuth } from "@/contexts";
import { useUsersQuery } from "@/hooks/queries";

const SettingsPage = () => {
  const { user } = useAuth();
  const { data: users, isLoading } = useUsersQuery();

  return (
    <SettingsTemplate user={user} users={users} isLoadingUsers={isLoading} />
  );
};

export default SettingsPage;
