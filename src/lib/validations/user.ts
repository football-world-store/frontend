import { z } from "zod";

import { emailField, nameField, passwordField } from "./shared";

const USER_ROLES = ["OWNER", "EMPLOYEE"] as const;

export const userSchema = z.object({
  name: nameField,
  email: emailField,
  password: passwordField,
  role: z.enum(USER_ROLES, { error: "Selecione um perfil" }),
});

export type UserFormValues = z.infer<typeof userSchema>;

export const USER_ROLE_OPTIONS = [
  { value: "OWNER", label: "Dono" },
  { value: "EMPLOYEE", label: "Funcionário" },
];
