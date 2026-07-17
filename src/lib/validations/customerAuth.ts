import { z } from "zod";

import { emailField } from "./shared";

export const requestMagicLinkSchema = z.object({
  email: emailField,
});

export type RequestMagicLinkFormValues = z.infer<typeof requestMagicLinkSchema>;
