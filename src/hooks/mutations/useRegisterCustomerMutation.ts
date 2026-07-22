import { useMutation } from "@tanstack/react-query";

import { customerAuthService } from "@/services";

export const useRegisterCustomerMutation = () =>
  useMutation({
    mutationFn: customerAuthService.register,
  });
