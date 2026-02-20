import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

// Si déjà créé, on réutilise, sinon on crée
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // log: ["query", "error", "warn"], // décommentez pour debug
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
