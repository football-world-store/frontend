import type { CustomerReservation } from "./reservation";
import type { Sale } from "./sale";

/**
 * Shape confirmado contra
 * backend/src/modules/customer-auth/use-case/my-orders.use-case.ts —
 * GET /customer-auth/me/orders devolve { data: { purchases, reservations } },
 * não uma lista única mesclada.
 */
export interface CustomerOrders {
  purchases: Sale[];
  reservations: CustomerReservation[];
}
