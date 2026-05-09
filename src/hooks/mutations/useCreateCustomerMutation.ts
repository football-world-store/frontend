import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// O backend ainda não expõe POST /customers. Este hook fica como
// placeholder para preservar a API do CustomerForm; troque a mutationFn
// por `customersService.create` quando o endpoint estiver pronto.
export const useCreateCustomerMutation = () =>
  useMutation({
    mutationFn: async () => {
      toast.info(
        "Cadastro de clientes ainda não está disponível. Aguardando o backend.",
      );
      throw new Error("customers backend not implemented");
    },
  });
