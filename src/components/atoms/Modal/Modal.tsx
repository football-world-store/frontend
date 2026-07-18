"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

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
  md: "md:max-w-lg",
  lg: "md:max-w-2xl",
  xl: "md:max-w-4xl",
};

const SWIPE_DISMISS_THRESHOLD = 120;
const SWIPE_VELOCITY_THRESHOLD = 0.6;
const MOBILE_BREAKPOINT_PX = 768;

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
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const dragStartTime = useRef<number>(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const requestClose = () => {
    setDragOffset(0);
    setIsDragging(false);
    dragStartY.current = null;
    onClose();
  };

  const isMobile = () =>
    typeof window !== "undefined" &&
    window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`).matches;

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isMobile()) return;
    if ((event.target as HTMLElement).closest("button")) return;
    dragStartY.current = event.clientY;
    dragStartTime.current = Date.now();
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) return;
    const delta = event.clientY - dragStartY.current;
    setDragOffset(Math.max(0, delta));
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) return;
    const delta = event.clientY - dragStartY.current;
    const elapsed = Date.now() - dragStartTime.current;
    const velocity = delta / Math.max(elapsed, 1);
    const shouldDismiss =
      delta > SWIPE_DISMISS_THRESHOLD ||
      (delta > 40 && velocity > SWIPE_VELOCITY_THRESHOLD);

    event.currentTarget.releasePointerCapture(event.pointerId);
    dragStartY.current = null;
    setIsDragging(false);

    if (shouldDismiss) {
      requestClose();
    } else {
      setDragOffset(0);
    }
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) requestClose();
  };

  const sheetTransform = dragOffset > 0 ? `translateY(${dragOffset}px)` : "";
  const sheetTransition = isDragging
    ? "none"
    : "transform 240ms cubic-bezier(0.32, 0.72, 0, 1)";

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      onClose={requestClose}
      onClick={handleBackdropClick}
      className={`bg-transparent p-0 backdrop:bg-surface/85 backdrop:backdrop-blur-md fixed inset-0 m-0 h-full max-h-screen w-full max-w-full md:inset-auto md:top-1/2 md:left-1/2 md:h-auto md:max-h-[90vh] md:-translate-x-1/2 md:-translate-y-1/2 md:w-full ${SIZE_CLASSES[size]}`}
    >
      <div
        ref={sheetRef}
        style={{
          transform: sheetTransform || undefined,
          transition: sheetTransition,
        }}
        className="bg-glass shadow-glass flex h-full flex-col overflow-hidden md:h-auto md:max-h-[90vh] absolute inset-x-0 bottom-0 top-12 rounded-t-3xl md:relative md:inset-auto md:top-auto md:rounded-xl"
      >
        {/* Grab handle — só mobile, indica que o sheet pode ser arrastado */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="md:hidden flex flex-col items-center pt-3 pb-1 touch-none select-none"
          aria-hidden
        >
          <span className="block h-1.5 w-12 rounded-pill bg-on-surface-variant/40" />
        </div>

        <header
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex items-start justify-between gap-4 px-6 pt-3 pb-5 md:pt-6 md:pb-4 touch-none md:touch-auto"
        >
          <div className="space-y-1.5 min-w-0">
            <span className="font-label text-[0.625rem] uppercase tracking-[0.2em] text-primary block">
              Painel
            </span>
            <h2 className="font-headline text-xl md:text-2xl font-extrabold text-on-surface tracking-[-0.03em] truncate">
              {title}
            </h2>
            {description ? (
              <p className="font-body text-sm text-on-surface-variant">
                {description}
              </p>
            ) : null}
          </div>
          <IconButton iconName="close" label="Fechar" onClick={requestClose} />
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-6">{children}</div>

        {footer ? (
          <footer className="bg-surface-container-high/60 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            {footer}
          </footer>
        ) : null}
      </div>
    </dialog>
  );
};
