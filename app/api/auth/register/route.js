import { NextResponse } from "next/server";
import { prisma } from "../../../../src/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    // Recuperer les donnees du formulaire
    const body = await request.json();
    const { name, email, password } = body;

    // Validation des champs obligatoires
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Validation du format email (simple)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Format email invalide" },
        { status: 400 }
      );
    }

    // Validation longueur mot de passe
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Mot de passe trop court (minimum 6 caracteres)" },
        { status: 400 }
      );
    }

    // Verifier si l'email existe deja
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Cet email est deja utilise" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe avec bcrypt
    // Le "10" est le nombre de rounds (cout de calcul)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creer l'utilisateur en base
    const user = await prisma.user.create({
      data: {
        name: name?.trim() || null,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "USER" // Role par defaut
      }
    });

    // Retourner une reponse de succes (sans le mot de passe !)
    return NextResponse.json(
      {
        message: "Inscription reussie",
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Erreur inscription:", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de l'inscription" },
      { status: 500 }
    );
  }
}
