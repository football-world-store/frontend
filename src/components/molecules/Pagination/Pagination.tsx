import { IconButton } from "@/components/atoms";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  itemCount: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  page,
  totalPages,
  total,
  itemCount,
  itemLabel,
  onPageChange,
}: PaginationProps) => (
  <footer className="flex items-center justify-between pt-4">
    <span className="font-label text-xs text-on-surface-variant">
      Mostrando {itemCount} de {total} {itemLabel}
    </span>
    <div className="flex items-center gap-2">
      <IconButton
        iconName="chevron_left"
        label="Anterior"
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      />
      <span className="font-label text-xs text-on-surface-variant">
        {page} / {totalPages}
      </span>
      <IconButton
        iconName="chevron_right"
        label="Próxima"
        disabled={page >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      />
    </div>
  </footer>
);
