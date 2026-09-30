import CustomerOrderReceiptClient from "./CustomerOrderReceiptClient";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function CustomerOrderReceiptPage() {
  return <CustomerOrderReceiptClient />;
}
