"use client";

import { type ReactNode } from "react";

import { Button, Modal } from "@/components/atoms";

type ConfirmTone = "primary" | "danger";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmTone;
  isPending?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "primary",
  isPending = false,
}: ConfirmDialogProps) => {
  const handleConfirm = () => {
    if (isPending) return;
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={typeof description === "string" ? description : undefined}
      size="md"
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleConfirm}
            disabled={isPending}
            className={
              tone === "danger"
                ? "bg-error bg-none text-on-error hover:bg-error/90 hover:bg-none"
                : undefined
            }
          >
            {isPending ? "Processando…" : confirmLabel}
          </Button>
        </>
      }
    >
      {typeof description !== "string" && description ? (
        <div className="font-body text-sm text-on-surface-variant">
          {description}
        </div>
      ) : null}
    </Modal>
  );
};
