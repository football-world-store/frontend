export interface RegisterCustomerBody {
  name: string;
  email: string;
  password: string;
  whatsapp: string;
}

export interface CustomerLoginBody {
  email: string;
  password: string;
}

export interface RequestMagicLinkBody {
  email: string;
}

export interface VerifyMagicLinkBody {
  token: string;
}

/**
 * Shape confirmado contra
 * backend/src/modules/customer-auth/use-case/verify-magic-link.use-case.ts —
 * POST /customer-auth/verify devolve { data: { customer: CustomerIdentity } }.
 */
export interface CustomerIdentity {
  id: string;
  name: string;
  email: string;
}

export interface VerifyMagicLinkResponseData {
  customer: CustomerIdentity;
}
