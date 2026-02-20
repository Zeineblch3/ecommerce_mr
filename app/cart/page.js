import { requireAuth } from "../../src/lib/auth-utils";
import { prisma } from "../../src/lib/prisma";
import Image from "next/image";
import CartItemRow from "../../src/components/CartItemRow";
import Link from "next/link";

export default async function CartPage() {
  // Vérifier que l'utilisateur est connecté
  const session = await requireAuth();

  // Récupérer les items du panier
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: true
    },
    orderBy: { createdAt: "desc" }
  });

  // Calculer le total
  const total = cartItems.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Mon Panier
      </h1>

      {cartItems.length === 0 ? (
        // Panier vide
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Votre panier est vide
          </p>
          <Link
            href="/products"
            className="text-blue-600 hover:underline"
          >
            Continuer mes achats
          </Link>
        </div>
      ) : (
        <div>
          {/* Liste des produits */}
          <div className="space-y-4 mb-8">
            {cartItems.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          {/* Total et bouton commande */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold">Total :</span>
              <span className="text-2xl font-bold text-blue-600">
                {total.toFixed(2)} DT
              </span>
            </div>

            <div className="flex gap-4">
              <Link
                href="/products"
                className="flex-1 text-center border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
              >
                Continuer mes achats
              </Link>
              <Link
                href="/checkout"
                className="flex-1 text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Passer commande
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
