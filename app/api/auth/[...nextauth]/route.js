import NextAuth from "next-auth";
import { authOptions } from "../../../../src/lib/auth";

// Creation du handler NextAuth
const handler = NextAuth(authOptions);

// Export pour les methodes GET et POST
export { handler as GET, handler as POST };
