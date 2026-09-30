import SaleReceiptClient from "./SaleReceiptClient";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function SaleReceiptPage() {
  return <SaleReceiptClient />;
}
