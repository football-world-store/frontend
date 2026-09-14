import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { customerAuthService } from "@/services";

export const useUpdateCustomerProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerAuthService.updateProfile,
    onSuccess: (profile) => {
      toast.success("Dados atualizados com sucesso.");
      queryClient.setQueryData(queryKeys.customerAuth.profile(), profile);
      queryClient.setQueryData(queryKeys.customerAuth.identity(), {
        id: profile.id,
        name: profile.name,
        email: profile.email ?? "",
      });
    },
  });
};
