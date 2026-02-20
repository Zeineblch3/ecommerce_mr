import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product, priority = false }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image optimisée */}
        <div className="relative aspect-square">
          <Image
            src={product.imageUrl || "/placeholder-product.jpg"}
            alt={product.title}
            fill // Remplit le conteneur parent
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL="/placeholder-blur.jpg"
            loading={priority ? "eager" : "lazy"} // priorité LCP pour certaines images
            priority={priority} // Next.js LCP optimization
            unoptimized
          />
        </div>

        {/* Informations produit */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 truncate">{product.title}</h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
          <p className="text-blue-600 font-bold mt-2">
            {product.price.toFixed(2)} TND
          </p>
        </div>
      </div>
    </Link>
  );
}
