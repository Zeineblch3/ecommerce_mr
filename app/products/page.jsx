import Link from "next/link";
import { prisma } from "../lib/prisma";

export const dynamic = "force-dynamic";
// En dev : on force la page à se re-rendre. En prod, on ajustera le caching.

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Catalogue (DB)</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            className="border rounded overflow-hidden hover:shadow"
          >
            <div className="h-48 bg-gray-100">
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <div className="p-4">
              <h2 className="font-semibold">{p.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">
                {p.description}
              </p>
              <p className="mt-2 font-bold">{p.price} TND</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
