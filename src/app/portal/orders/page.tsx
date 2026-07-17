"use client";

import { CustomerOrdersList } from "@/components/organisms";

const OrdersPage = () => {
  return (
    <main className="min-h-screen bg-surface p-6 md:p-12 font-body text-on-surface">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="font-headline text-2xl md:text-3xl font-extrabold tracking-[-0.04em]">
            Meus <span className="text-primary italic">pedidos</span>
          </h1>
          <p className="text-on-surface-variant text-sm">
            Compras e reservas associadas ao seu email.
          </p>
        </header>
        <CustomerOrdersList />
      </div>
    </main>
  );
};

export default OrdersPage;
