import type { CustomerIdentity, CustomerOrders } from "@/types";

const CUSTOMER_PORTAL_NAME = "Lucas Andrade";

export const customerIdentityFixture: CustomerIdentity = {
  id: "cust-portal-001",
  name: CUSTOMER_PORTAL_NAME,
  email: "lucas@example.com",
};

export const customerOrdersFixture: CustomerOrders = {
  purchases: [
    {
      id: "s-001",
      saleNumber: 1001,
      channel: "LOJA_FISICA",
      paymentMethod: "PIX",
      status: "CONFIRMED",
      customerId: "cust-portal-001",
      customerName: CUSTOMER_PORTAL_NAME,
      discount: 0,
      totalAmount: 459.0,
      saleDate: "2026-04-25T14:30:00.000Z",
      createdAt: "2026-04-25T14:30:00.000Z",
      cancelledAt: null,
      cancelledBy: null,
      cancelReason: null,
      userId: "u-001",
      userName: "Edimilson Junior",
      items: [
        {
          id: "si-001",
          productId: "p-002",
          productName: "Camisa Corinthians Home 2026",
          productInternalCode: "FWS-0002",
          quantity: 1,
          unitPrice: 459.0,
          subtotal: 459.0,
        },
      ],
    },
  ],
  reservations: [
    {
      id: "r-001",
      productName: "Camisa Corinthians Home 2026",
      size: "G",
      quantity: 1,
      status: "CONFIRMED",
      expiresAt: "2026-05-02T10:00:00.000Z",
      createdAt: "2026-05-01T10:00:00.000Z",
    },
  ],
};
