"use server";

import { prisma } from "../../src/lib/prisma";

// Création d'une catégorie
export async function createCategory(formData) {
  const name = formData.get("name")?.trim();

  if (!name) throw new Error("Nom requis");

  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const category = await prisma.category.create({
    data: { name, slug }
  });

  return category;
}
