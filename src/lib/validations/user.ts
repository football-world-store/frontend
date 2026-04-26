import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.email("Email inválido"),
  role: z.enum(["OWNER", "EMPLOYEE"], { error: "Selecione um perfil" }),
});

export type UserFormValues = z.infer<typeof userSchema>;

export const USER_ROLE_OPTIONS = [
  { value: "OWNER", label: "Dono" },
  { value: "EMPLOYEE", label: "Funcionário" },
];
