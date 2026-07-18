import { useAuth } from "@/contexts";

interface Permission {
  isOwner: boolean;
}

export const usePermission = (): Permission => {
  const { user } = useAuth();
  return { isOwner: user?.role === "OWNER" };
};
