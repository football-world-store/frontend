"use client";

import { useState } from "react";

import { Button, Icon, Modal } from "@/components/atoms";
import {
  Card,
  EmptyState,
  Pagination,
  SkeletonTableRow,
} from "@/components/molecules";
import {
  useCancelReservationMutation,
  useConfirmReservationMutation,
} from "@/hooks/mutations";
import { useReservationsQuery } from "@/hooks/queries";
import type { Reservation, ReservationStatus } from "@/types";
import { formatDateBR } from "@/utils";

const ITEMS_PER_PAGE = 10;

const STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  EXPIRED: "Expirada",
};

const STATUS_CLASSES: Record<ReservationStatus, string> = {
  PENDING: "bg-primary/15 text-primary",
  CONFIRMED: "bg-tertiary/15 text-tertiary",
  CANCELLED: "bg-error/15 text-error",
  EXPIRED: "bg-surface-container-highest text-on-surface-variant",
};

const STATUS_FILTERS: { value: ReservationStatus | ""; label: string }[] = [
  { value: "", label: "Todas" },
  { value: "PENDING", label: "Pendentes" },
  { value: "CONFIRMED", label: "Confirmadas" },
  { value: "CANCELLED", label: "Canceladas" },
  { value: "EXPIRED", label: "Expiradas" },
];

const isExpiringSoon = (expiresAt: string) => {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return diff > 0 && diff < 2 * 60 * 60 * 1000;
};

export const ReservationsTable = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "">(
    "PENDING",
  );
  const [search, setSearch] = useState("");

  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [cancellingReservation, setCancellingReservation] =
    useState<Reservation | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const { data, isLoading } = useReservationsQuery({
    page,
    limit: ITEMS_PER_PAGE,
    status: statusFilter || undefined,
    search: search || undefined,
  });

  const confirmMutation = useConfirmReservationMutation();
  const cancelMutation = useCancelReservationMutation();

  const reservations = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;
  const confirmingReservation = confirmingId
    ? (reservations.find((r) => r.id === confirmingId) ?? null)
    : null;

  const handleConfirm = () => {
    if (!confirmingId) return;
    confirmMutation.mutate(
      { id: confirmingId },
      { onSettled: () => setConfirmingId(null) },
    );
  };

  const handleCancel = () => {
    if (!cancellingReservation) return;
    cancelMutation.mutate(
      {
        id: cancellingReservation.id,
        cancelReason: cancelReason.trim() || undefined,
      },
      {
        onSettled: () => {
          setCancellingReservation(null);
          setCancelReason("");
        },
      },
    );
  };

  const desktopHeader = (
    <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 font-label text-[10px] uppercase tracking-wider text-on-surface-variant">
      <span className="col-span-3">Produto</span>
      <span className="col-span-2">Cliente</span>
      <span className="col-span-2">WhatsApp</span>
      <span className="col-span-1 text-center">Qtd</span>
      <span className="col-span-2">Expira em</span>
      <span className="col-span-1 text-center">Status</span>
      <span className="col-span-1" />
    </div>
  );

  return (
    <>
      <Card
        tier="container-high"
        title="Reservas"
        description="Criadas pelo chatbot. Confirme para debitar o estoque."
      >
        <div className="space-y-4 mb-5">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              <Icon name="search" size="sm" />
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar por nome ou WhatsApp..."
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-surface-container-lowest text-on-surface text-sm focus-visible:outline-none focus-visible:ring-focus-gold"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setStatusFilter(opt.value);
                  setPage(1);
                }}
                aria-pressed={statusFilter === opt.value}
                className={`h-8 px-4 rounded-pill font-label text-xs uppercase tracking-wider font-semibold transition-colors focus-visible:outline-none focus-visible:ring-focus-gold ${
                  statusFilter === opt.value
                    ? "bg-metallic text-on-primary"
                    : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <SkeletonTableRow count={5} cells={6} />
        ) : reservations.length === 0 ? (
          <EmptyState
            iconName="bookmark"
            title="Nenhuma reserva"
            description="Reservas criadas pelo chatbot aparecem aqui."
          />
        ) : (
          <div className="space-y-2">
            {desktopHeader}
            {reservations.map((r) => (
              <ReservationRow
                key={r.id}
                reservation={r}
                onConfirm={() => setConfirmingId(r.id)}
                onCancel={() => {
                  setCancellingReservation(r);
                  setCancelReason("");
                }}
              />
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <div className="mt-6">
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              itemCount={reservations.length}
              itemLabel="reservas"
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </Card>

      {/* Confirm modal */}
      <Modal
        isOpen={Boolean(confirmingReservation)}
        onClose={() => setConfirmingId(null)}
        title="Confirmar reserva"
        description="O estoque será decrementado imediatamente."
        size="md"
      >
        {confirmingReservation ? (
          <div className="space-y-5">
            <div className="rounded-xl bg-surface-container-high p-4 space-y-1">
              <p className="font-body text-sm font-semibold text-on-surface">
                {confirmingReservation.productName}
              </p>
              <p className="font-label text-xs text-on-surface-variant">
                {confirmingReservation.productCode} · Tam.{" "}
                {confirmingReservation.productSize} ·{" "}
                {confirmingReservation.quantity} un.
              </p>
              <p className="font-label text-xs text-on-surface-variant">
                Cliente: {confirmingReservation.customerName} —{" "}
                {confirmingReservation.customerWhatsapp}
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => setConfirmingId(null)}
                disabled={confirmMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={confirmMutation.isPending}
              >
                {confirmMutation.isPending
                  ? "Confirmando..."
                  : "Confirmar reserva"}
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Cancel modal */}
      <Modal
        isOpen={Boolean(cancellingReservation)}
        onClose={() => {
          setCancellingReservation(null);
          setCancelReason("");
        }}
        title="Cancelar reserva"
        description="Informe o motivo (opcional)."
        size="md"
      >
        {cancellingReservation ? (
          <div className="space-y-5">
            <div className="rounded-xl bg-surface-container-high p-4 space-y-1">
              <p className="font-body text-sm font-semibold text-on-surface">
                {cancellingReservation.productName}
              </p>
              <p className="font-label text-xs text-on-surface-variant">
                Cliente: {cancellingReservation.customerName}
              </p>
            </div>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Motivo do cancelamento (opcional)"
              rows={3}
              className="w-full rounded-xl bg-surface-container-lowest text-on-surface text-sm px-4 py-3 resize-none focus-visible:outline-none focus-visible:ring-focus-gold placeholder:text-on-surface-variant"
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setCancellingReservation(null);
                  setCancelReason("");
                }}
                disabled={cancelMutation.isPending}
              >
                Voltar
              </Button>
              <Button
                variant="danger"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending
                  ? "Cancelando..."
                  : "Cancelar reserva"}
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
};

const ReservationRow = ({
  reservation: r,
  onConfirm,
  onCancel,
}: {
  reservation: Reservation;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const expiring = r.status === "PENDING" && isExpiringSoon(r.expiresAt);
  const isPending = r.status === "PENDING";
  const isCancellable = r.status === "PENDING" || r.status === "CONFIRMED";

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden rounded-xl bg-surface-container-low p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-body text-sm font-semibold text-on-surface truncate">
              {r.productName}
            </p>
            <p className="font-label text-xs text-on-surface-variant">
              {r.productCode} · Tam. {r.productSize} · {r.quantity} un.
            </p>
          </div>
          <span
            className={`flex-shrink-0 rounded-pill px-2.5 py-1 font-label text-[10px] uppercase tracking-wider font-semibold ${STATUS_CLASSES[r.status]}`}
          >
            {STATUS_LABELS[r.status]}
          </span>
        </div>
        <div className="space-y-1">
          <p className="font-body text-sm text-on-surface">{r.customerName}</p>
          <p className="font-label text-xs text-on-surface-variant">
            {r.customerWhatsapp}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span
            className={`font-label text-xs ${expiring ? "text-error font-semibold" : "text-on-surface-variant"}`}
          >
            {expiring ? "⚠ " : ""}Expira {formatDateBR(r.expiresAt)}
          </span>
          {isPending || isCancellable ? (
            <div className="flex gap-2">
              {isPending ? (
                <Button size="sm" onClick={onConfirm}>
                  Confirmar
                </Button>
              ) : null}
              {isCancellable ? (
                <Button size="sm" variant="ghost" onClick={onCancel}>
                  Cancelar
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:grid grid-cols-12 gap-4 items-center px-4 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
        <div className="col-span-3 min-w-0">
          <p className="font-body text-sm font-semibold text-on-surface truncate">
            {r.productName}
          </p>
          <p className="font-label text-xs text-on-surface-variant">
            {r.productCode} · Tam. {r.productSize}
          </p>
        </div>
        <div className="col-span-2 min-w-0">
          <p className="font-body text-sm text-on-surface truncate">
            {r.customerName}
          </p>
          {r.customerEmail ? (
            <p className="font-label text-xs text-on-surface-variant truncate">
              {r.customerEmail}
            </p>
          ) : null}
        </div>
        <p className="col-span-2 font-label text-xs text-on-surface-variant">
          {r.customerWhatsapp}
        </p>
        <span className="col-span-1 text-center font-body text-sm font-semibold text-on-surface">
          {r.quantity}
        </span>
        <span
          className={`col-span-2 font-label text-xs ${expiring ? "text-error font-semibold" : "text-on-surface-variant"}`}
        >
          {expiring ? "⚠ " : ""}
          {formatDateBR(r.expiresAt)}
        </span>
        <span
          className={`col-span-1 text-center rounded-pill px-2 py-1 font-label text-[10px] uppercase tracking-wider font-semibold ${STATUS_CLASSES[r.status]}`}
        >
          {STATUS_LABELS[r.status]}
        </span>
        <div className="col-span-1 flex gap-1 justify-end">
          {isPending ? (
            <button
              type="button"
              onClick={onConfirm}
              title="Confirmar"
              className="h-8 w-8 flex items-center justify-center rounded-lg text-tertiary hover:bg-tertiary/10 transition-colors focus-visible:outline-none focus-visible:ring-focus-gold"
            >
              <Icon name="check_circle" size="sm" />
            </button>
          ) : null}
          {isCancellable ? (
            <button
              type="button"
              onClick={onCancel}
              title="Cancelar"
              className="h-8 w-8 flex items-center justify-center rounded-lg text-error hover:bg-error/10 transition-colors focus-visible:outline-none focus-visible:ring-focus-gold"
            >
              <Icon name="cancel" size="sm" />
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};
