import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

// Configuration des options NextAuth
export const authOptions = {
  // Providers d'authentification
  providers: [
    // Provider Credentials : email/mot de passe
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },

      // Fonction de verification des identifiants
      async authorize(credentials) {
        // Verification que les champs sont remplis
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        // Recherche de l'utilisateur en base
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // Verification que l'utilisateur existe
        if (!user) {
          throw new Error("Utilisateur non trouve");
        }

        // Verification que l'utilisateur a un mot de passe (pas OAuth)
        if (!user.password) {
          throw new Error("Connectez-vous avec Google ou GitHub");
        }

        // Verification du mot de passe
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Mot de passe incorrect");
        }

        // Retourne l'utilisateur (sera stocke dans le token)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image
        };
      }
    }),

    // Provider Google (optionnel)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }),

    // Provider GitHub (optionnel)
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || ""
    })
  ],
  // Callbacks pour personnaliser le comportement
  callbacks: {
    // Callback JWT : ajoute des infos au token
    async jwt({ token, user }) {
      // Si l'utilisateur vient de se connecter
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    // Callback session : expose les infos dans la session client
    async session({ session, token }) {
      // Ajoute l'id et le role a la session
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },

    // Callback signIn : logique supplementaire a la connexion OAuth
    async signIn({ user, account }) {
      // Pour OAuth : creer ou mettre a jour l'utilisateur
      if (account?.provider === "google" || account?.provider === "github") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        });

        if (!existingUser) {
          // Creer l'utilisateur si premiere connexion OAuth
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              emailVerified: new Date(),
              role: "USER" // Role par defaut
            }
          });
        }
      }
      return true;
    }
  },

  // Pages personnalisees
  pages: {
    signIn: "/auth/login", // Page de connexion
    error: "/auth/error",   // Page d'erreur
    newUser: "/auth/register" // Page d'inscription
  },

  // Configuration de la session
  session: {
    strategy: "jwt", // Utilise JWT (pas de stockage en DB)
    maxAge: 30 * 24 * 60 * 60 // 30 jours
  },

  // Secret pour signer les tokens
  secret: process.env.NEXTAUTH_SECRET
};
