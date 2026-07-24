import Link from "next/link";

import { Avatar, Badge, Icon, IconButton } from "@/components/atoms";
import { APP_ROUTES } from "@/constants";
import type { Customer, CustomerStatus } from "@/types";
import { formatCurrencyBRL } from "@/utils";

const PRICE_CENTS_MULTIPLIER = 100;
const VIP_THRESHOLD = 2000;

const STATUS_TONE: Record<CustomerStatus, "success" | "warning" | "neutral"> = {
  ACTIVE: "success",
  COOLING: "warning",
  INACTIVE: "neutral",
};

const STATUS_LABEL: Record<CustomerStatus, string> = {
  ACTIVE: "Ativo",
  COOLING: "Esfriando",
  INACTIVE: "Sumido",
};

const buildWhatsappLink = (phone: string | null) => {
  if (!phone) return null;
  const normalized = phone.replace(/\D/g, "");
  return normalized ? `https://wa.me/${normalized}` : null;
};

interface CustomerRowProps {
  customer: Customer;
}

export const CustomerRow = ({ customer }: CustomerRowProps) => {
  const whatsappLink = buildWhatsappLink(customer.phone);
  const isVip = customer.totalSpent >= VIP_THRESHOLD;

  return (
    <li className="relative bg-surface-container-low rounded-xl px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2 hover:bg-surface-bright transition-colors">
      <Avatar name={customer.name} />
      <div className="flex-1 min-w-0">
        <Link
          href={APP_ROUTES.app.customerDetail(customer.id)}
          className="font-body text-sm font-semibold text-on-surface hover:text-primary transition-colors after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-focus-gold rounded-lg"
        >
          {customer.name}
        </Link>
        <p className="font-label text-xs text-on-surface-variant truncate">
          {customer.phone ?? customer.email ?? "Sem contato"}
        </p>
      </div>
      <div className="relative z-10 ml-auto flex-shrink-0 flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="font-label text-xs text-on-surface-variant">
            Total gasto
          </p>
          <p className="font-body text-sm font-semibold text-on-surface">
            {formatCurrencyBRL(customer.totalSpent * PRICE_CENTS_MULTIPLIER)}
          </p>
        </div>
        <span className="hidden sm:inline-flex">
          <Badge tone={STATUS_TONE[customer.status]}>
            {STATUS_LABEL[customer.status]}
          </Badge>
        </span>
        {isVip ? (
          <span className="hidden sm:inline-flex">
            <Badge tone="primary">VIP</Badge>
          </span>
        ) : null}
        {whatsappLink ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Conversar no WhatsApp"
            className="h-11 w-11 inline-flex items-center justify-center rounded-xl bg-tertiary-container text-on-tertiary hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-focus-gold"
          >
            <Icon name="forum" size="md" />
          </a>
        ) : (
          <IconButton iconName="forum" label="Sem telefone" disabled />
        )}
      </div>
    </li>
  );
};
