"use server";

import { prisma } from "../../src/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../src/lib/auth-utils";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createProduct(formData) {
  await requireAdmin();

  const title = formData.get("title");
  const description = formData.get("description");
  const price = parseFloat(formData.get("price"));
  const stock = parseInt(formData.get("stock"));
  const imageUrl = formData.get("imageUrl");

  const slug = slugify(title);

  await prisma.product.create({
    data: {
      title,
      description,
      price,
      stock,
      imageUrl,
      slug
    }
  });

  revalidatePath("/products");
}
export async function getAllProducts() {
  return prisma.product.findMany();
}

export async function getProductById(id) {
  return prisma.product.findUnique({
    where: { id }, 
    include: { category: true },
  });
}