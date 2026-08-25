import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { FormEvent } from "react";
import type { AppDispatch } from "../store/store";
import { getShoppingList, updateShoppingList } from "../services/api";
import { updateShoppingList as updateShoppingListState } from "../store/slices/ShoppingListSlice";

function EditShoppingList() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState("");

  const [category, setCategory] = useState("");

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadShoppingList() {
      try {
        if (!id) {
          setError("Shopping list could not be found.");

          return;
        }

        const list = await getShoppingList(id);

        setName(list.name || "");

        setCategory(list.category || "");

        setNotes(list.notes || "");
      } catch {
        setError("Unable to load the shopping list.");
      } finally {
        setLoading(false);
      }
    }

    loadShoppingList();
  }, [id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    if (!id) {
      setError("Shopping list could not be found.");

      return;
    }

    if (!name.trim()) {
      setError("Please enter a shopping list name.");

      return;
    }

    if (!category.trim()) {
      setError("Please enter a category.");

      return;
    }

    try {
      setSaving(true);

      const updatedList = {
        name: name.trim(),
        category: category.trim(),
        notes: notes.trim(),
      };

      const savedList = await updateShoppingList(id, updatedList);

      dispatch(updateShoppingListState(savedList));

      navigate("/home");
    } catch {
      setError("Unable to update shopping list.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="form-page">
        <section className="form-card">
          <p>Loading shopping list...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="form-page">
      <section className="form-card">
        <div className="form-card-header">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/home")}
          >
            ← Back
          </button>

          <h1>Edit Shopping List</h1>

          <p>Update the information for your shopping list.</p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form className="page-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">List Name</label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Weekly Groceries"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>

            <input
              id="category"
              type="text"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="e.g. Groceries"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>

            <textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add any notes for this list..."
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={() => navigate("/home")}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button button-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default EditShoppingList;
