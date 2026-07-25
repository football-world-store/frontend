import { Badge } from "@/components/atoms";
import type { MonthlyReport } from "@/types";
import { formatDateBR, formatPriceFromReais, zebraRowTier } from "@/utils";

interface MonthlyReportContentProps {
  report: MonthlyReport;
}

export const MonthlyReportContent = ({ report }: MonthlyReportContentProps) => (
  <div className="flex flex-col gap-5">
    <div>
      <p className="font-headline text-xl font-extrabold text-on-surface">
        Relatório de {report.period.month}
      </p>
      <p className="font-label text-xs text-on-surface-variant">
        {formatDateBR(report.period.from)} — {formatDateBR(report.period.to)}
      </p>
    </div>

    <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface-container-low p-4">
      <div>
        <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
          Faturamento
        </p>
        <p className="font-body text-lg font-bold text-primary">
          {formatPriceFromReais(report.sales.totalAmount)}
        </p>
      </div>
      <div>
        <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
          Lucro bruto
        </p>
        <p className="font-body text-lg font-bold text-on-surface">
          {formatPriceFromReais(report.sales.grossProfit)} (
          {report.sales.marginPercentage}%)
        </p>
      </div>
      <div>
        <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
          Vendas
        </p>
        <p className="font-body text-sm text-on-surface">
          {report.sales.count} · ticket médio{" "}
          {formatPriceFromReais(report.sales.averageTicket)}
        </p>
      </div>
      <div>
        <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
          Estoque
        </p>
        <p className="font-body text-sm text-on-surface">
          {report.stock.totalItems} itens ·{" "}
          {formatPriceFromReais(report.stock.stockValue)}
        </p>
      </div>
    </div>

    <div>
      <p className="mb-2 font-label text-xs uppercase tracking-wider text-on-surface-variant">
        Top produtos
      </p>
      {report.topProducts.length === 0 ? (
        <p className="rounded-xl bg-surface-container-low px-4 py-3 font-label text-xs text-on-surface-variant">
          Nenhuma venda no período.
        </p>
      ) : (
        <ul className="flex flex-col gap-1 overflow-hidden rounded-xl">
          {report.topProducts.map((product, index) => (
            <li
              key={product.id}
              className={`flex items-center justify-between gap-3 px-4 py-2 ${zebraRowTier(index)}`}
            >
              <div className="min-w-0">
                <p className="font-body text-sm text-on-surface truncate">
                  {product.name}
                </p>
                <p className="font-label text-xs text-on-surface-variant">
                  {product.internalCode} · {product.totalSold}x
                </p>
              </div>
              <span className="font-body text-sm font-semibold text-on-surface">
                {formatPriceFromReais(product.totalRevenue)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <p className="mb-2 font-label text-xs uppercase tracking-wider text-on-surface-variant">
          Por canal
        </p>
        <ul className="flex flex-col gap-1">
          {report.channels.map((channel) => (
            <li
              key={channel.channel}
              className="flex items-center justify-between gap-2 font-body text-sm text-on-surface"
            >
              <span>{channel.channel}</span>
              <Badge tone="neutral">{channel.percentage}%</Badge>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="mb-2 font-label text-xs uppercase tracking-wider text-on-surface-variant">
          Por pagamento
        </p>
        <ul className="flex flex-col gap-1">
          {report.paymentMethods.map((method) => (
            <li
              key={method.method}
              className="flex items-center justify-between gap-2 font-body text-sm text-on-surface"
            >
              <span>{method.method}</span>
              <Badge tone="neutral">{method.percentage}%</Badge>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
