import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

// Recuperer la session cote serveur
export async function getSession() {
  return await getServerSession(authOptions);
}

// Verifier que l'utilisateur est connecte
// Redirige vers login si non connecte
export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return session;
}

// Verifier que l'utilisateur a le role ADMIN
// Redirige vers unauthorized si pas admin
export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return session;
}

// Verifier un role specifique
export async function requireRole(role) {
  const session = await requireAuth();

  if (session.user.role !== role) {
    redirect("/unauthorized");
  }

  return session;
}
