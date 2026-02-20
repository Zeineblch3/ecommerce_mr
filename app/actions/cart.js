"use server";

import { getSession } from "../../src/lib/auth-utils";
import { prisma } from "../../src/lib/prisma";
import { revalidatePath } from "next/cache";

// Ajouter un produit au panier
export async function addToCart(productId, quantity = 1) {
  // Vérifier la session
  const session = await getSession();

  if (!session?.user?.id) {
    return { success: false, error: "Non connecté" };
  }

  const userId = session.user.id;

  try {
    // Vérifier que le produit existe
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return { success: false, error: "Produit introuvable" };
    }

    // Vérifier le stock
    if (product.stock < quantity) {
      return { success: false, error: "Stock insuffisant" };
    }

    // Ajouter ou mettre à jour le panier (upsert = update si existe, create sinon)
    await prisma.cartItem.upsert({
      where: {
        userId_productId: { userId, productId }
      },
      update: {
        // Incrémenter la quantité
        quantity: { increment: quantity }
      },
      create: {
        userId,
        productId,
        quantity
      }
    });

    // Revalider la page panier
    revalidatePath("/cart");

    return { success: true };

  } catch (error) {
    console.error("Erreur addToCart:", error);
    return { success: false, error: "Erreur serveur" };
  }
}

// Modifier la quantité d'un item
export async function updateCartItem(cartItemId, quantity) {
  const session = await getSession();

  if (!session?.user?.id) {
    return { success: false, error: "Non connecté" };
  }

  try {
    if (quantity <= 0) {
      // Supprimer si quantité <= 0
      await prisma.cartItem.delete({
        where: { id: cartItemId }
      });
    } else {
      // Mettre à jour la quantité
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity }
      });
    }

    revalidatePath("/cart");
    return { success: true };

  } catch (error) {
    console.error("Erreur updateCartItem:", error);
    return { success: false, error: "Erreur serveur" };
  }
}

// Supprimer un item du panier
export async function removeFromCart(cartItemId) {
  const session = await getSession();

  if (!session?.user?.id) {
    return { success: false, error: "Non connecté" };
  }

  try {
    await prisma.cartItem.delete({
      where: { id: cartItemId }
    });

    revalidatePath("/cart");
    return { success: true };

  } catch (error) {
    console.error("Erreur removeFromCart:", error);
    return { success: false, error: "Erreur serveur" };
  }
}

// Vider le panier
export async function clearCart() {
  const session = await getSession();

  if (!session?.user?.id) {
    return { success: false, error: "Non connecté" };
  }

  try {
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id }
    });

    revalidatePath("/cart");
    return { success: true };

  } catch (error) {
    console.error("Erreur clearCart:", error);
    return { success: false, error: "Erreur serveur" };
  }
}
