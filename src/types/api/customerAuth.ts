export interface RequestMagicLinkBody {
  email: string;
}

export interface VerifyMagicLinkBody {
  token: string;
}

/**
 * PLACEHOLDER — resposta de POST /customer-auth/verify não tem schema
 * documentado no OpenAPI, só a descrição "Sessão criada". Assumimos que o
 * backend devolve alguma identidade mínima do cliente, análoga ao "user" de
 * LoginResponseData, mas isso precisa ser confirmado contra o backend real.
 */
export interface CustomerIdentity {
  id?: string;
  name?: string;
  email?: string;
}
