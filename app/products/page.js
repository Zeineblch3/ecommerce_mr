import ProductCard from "../../src/components/ProductCard"; // chemin vers ton composant
import { prisma } from "../../src/lib/prisma";

export const dynamic = "force-dynamic"; // Pour forcer le SSR

export default async function ProductsPage() {
  // Récupérer les produits actifs depuis la DB
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-black">Catalogue</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            // Priorité pour les 3 premières images pour LCP
            priority={index < 3}
          />
        ))}
      </div>
    </div>
  );
}
