import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Acces non autorise
        </h2>

        <p className="text-gray-600 mb-6">
          Vous n avez pas les permissions necessaires pour acceder a cette page.
        </p>

        <Link
          href="/"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Retour a l accueil
        </Link>
      </div>
    </div>
  );
}
