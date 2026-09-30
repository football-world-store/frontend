import CustomerDetailClient from "./CustomerDetailClient";

// Exporta um param placeholder para satisfazer o output:export do Next.js.
// Na prática, qualquer /customers/[id] real é servido pelo CloudFront roteando
// para index.html e o React router cuida do render client-side.
export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function CustomerDetailPage() {
  return <CustomerDetailClient />;
}
