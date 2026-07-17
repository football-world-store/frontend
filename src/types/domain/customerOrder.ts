import type { Reservation } from "./reservation";
import type { Sale } from "./sale";

/**
 * PLACEHOLDER — GET /customer-auth/me/orders não tem schema documentado no
 * OpenAPI, só a descrição "Compras e reservas do cliente". Modelamos a
 * resposta como uma lista heterogênea discriminada por `kind`, mas esse
 * discriminador provavelmente não existe na resposta real — é adicionado
 * pelo customerAuthService ao normalizar o payload cru. Ajustar assim que
 * o formato real do backend for confirmado.
 */
export type CustomerOrder =
  ({ kind: "sale" } & Sale) | ({ kind: "reservation" } & Reservation);
