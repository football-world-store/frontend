import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/constants";
import { customerAuthService } from "@/services";
import type { CustomerProfile } from "@/types";

export const useUploadCustomerAvatarMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerAuthService.uploadAvatar,
    onSuccess: (photoUrl) => {
      toast.success("Foto atualizada.");
      queryClient.setQueryData<CustomerProfile>(
        queryKeys.customerAuth.profile(),
        (current) => (current ? { ...current, photoUrl } : current),
      );
    },
  });
};
