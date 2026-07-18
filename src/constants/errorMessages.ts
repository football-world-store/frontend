/**
 * Mapa de códigos de erro de negócio (backend) → mensagem amigável em PT-BR.
 * O backend (Nest) manda esses códigos SCREAMING_SNAKE_CASE dentro do próprio
 * campo `message` das exceptions (ex: `throw new UnauthorizedException("MISSING_REFRESH_TOKEN")`).
 * Ao adicionar uma exception nova no backend, adicione o código aqui também.
 */
const SESSION_EXPIRED_MESSAGE = "Sua sessão expirou. Faça login novamente.";

export const ERROR_MESSAGES: Record<string, string> = {
  // Auth (staff)
  INVALID_CREDENTIALS: "E-mail ou senha incorretos.",
  ACCOUNT_INACTIVE:
    "Sua conta ainda não foi aprovada. Fale com um administrador.",
  MISSING_REFRESH_TOKEN: SESSION_EXPIRED_MESSAGE,
  INVALID_REFRESH_TOKEN: SESSION_EXPIRED_MESSAGE,
  REFRESH_TOKEN_EXPIRED: SESSION_EXPIRED_MESSAGE,
  MISSING_TOKEN: SESSION_EXPIRED_MESSAGE,
  INVALID_TOKEN: SESSION_EXPIRED_MESSAGE,
  INVALID_OR_EXPIRED_TOKEN:
    "Este link expirou ou já foi usado. Solicite um novo.",
  ACCESS_DENIED: "Você não tem permissão para acessar este recurso.",

  // Customer Auth (portal)
  CUSTOMER_NOT_FOUND: "Cliente não encontrado.",

  // Users
  EMAIL_ALREADY_EXISTS: "Este e-mail já está cadastrado.",
  USER_NOT_FOUND: "Usuário não encontrado.",
  CANNOT_DEACTIVATE_SELF: "Você não pode desativar sua própria conta.",
  LAST_OWNER_PROTECTION:
    "Não é possível remover o último proprietário da conta.",

  // Products
  PRODUCT_NOT_FOUND: "Produto não encontrado.",
  PRODUCT_DUPLICATE: "Já existe um produto com esses dados.",
  PRODUCT_ALREADY_ACTIVE: "Este produto já está ativo.",
  PRODUCT_INACTIVE: "Este produto está inativo.",
  PRODUCT_OUT_OF_STOCK: "Este produto está sem estoque.",
  INSUFFICIENT_STOCK: "Estoque insuficiente para esta operação.",
  NO_PHOTO_TO_DELETE: "Este produto não tem foto para remover.",
  INVALID_FILE_FORMAT: "Formato de arquivo inválido.",

  // Stock entries
  STOCK_ENTRY_NOT_FOUND: "Entrada de estoque não encontrada.",
  STOCK_ENTRY_ALREADY_REVERSED: "Esta entrada já foi estornada.",
  CANNOT_REVERSE_REVERSAL: "Não é possível estornar um estorno.",
  STOCK_REVERSE_NEGATIVE: "O estorno deixaria o estoque negativo.",

  // Sales
  SALE_NOT_FOUND: "Venda não encontrada.",
  SALE_ALREADY_CANCELLED: "Esta venda já foi cancelada.",
  CUSTOMER_INACTIVE: "Este cliente está inativo.",

  // Customers
  CUSTOMER_EMAIL_DUPLICATE: "Já existe um cliente com este e-mail.",
  CUSTOMER_WHATSAPP_DUPLICATE: "Já existe um cliente com este WhatsApp.",

  // Alerts
  ALERT_NOT_FOUND: "Alerta não encontrado.",

  // Public / chatbot
  INVALID_API_KEY: "Chave de API inválida.",
};

export const VALIDATION_ERROR_MESSAGE =
  "Verifique os campos preenchidos e tente novamente.";

export const NETWORK_ERROR_MESSAGE =
  "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.";

export const TIMEOUT_ERROR_MESSAGE =
  "O servidor demorou para responder. Tente novamente.";
