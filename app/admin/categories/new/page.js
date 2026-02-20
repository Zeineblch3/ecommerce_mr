import { createCategory } from "../../../actions/categorie";

export default function NewCategoryActionPage() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">
        Créer une catégorie (Server Action)
      </h1>

      <form action={createCategory} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black">Nom</label>
          <input
            name="name"
            className="w-full border rounded p-2 text-black"
            required
          />
        </div>

        <button className="px-4 py-2 rounded bg-black text-white">
          Créer
        </button>

        <p className="text-sm text-gray-600">
          Après création, allez sur <code>/admin/categories</code> pour voir la liste.
        </p>
      </form>
    </div>
  );
}
