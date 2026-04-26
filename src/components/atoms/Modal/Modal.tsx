"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { IconButton } from "@/components/atoms/IconButton";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg" | "xl";
}

const SIZE_CLASSES: Record<NonNullable<ModalProps["size"]>, string> = {
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) onClose();
  };

  return (
    // <dialog> é interativo nativamente (gerencia foco, ESC, backdrop). O onClick
    // detecta apenas clique no backdrop para fechar — comportamento padrão do
    // Material/Apple. Teclado já tem ESC nativo, dispensando keyDown extra.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className={`bg-glass shadow-glass rounded-xl p-0 w-full ${SIZE_CLASSES[size]} backdrop:bg-surface/80 backdrop:backdrop-blur-sm`}
    >
      <div className="flex flex-col">
        <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
          <div className="space-y-1">
            <h2 className="font-headline text-xl font-bold text-on-surface tracking-tight">
              {title}
            </h2>
            {description ? (
              <p className="font-body text-sm text-on-surface-variant">
                {description}
              </p>
            ) : null}
          </div>
          <IconButton iconName="close" label="Fechar" onClick={onClose} />
        </header>
        <div className="px-6 pb-6">{children}</div>
        {footer ? (
          <footer className="bg-surface-container-low/40 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
            {footer}
          </footer>
        ) : null}
      </div>
    </dialog>
  );
};
