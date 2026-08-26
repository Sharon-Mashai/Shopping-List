import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch,RootState,} from "../store/store";
import {addShoppingList,} from "../store/slices/ShoppingListSlice";
import {createShoppingList,} from "../services/api";
import {searchUnsplashImage,} from "../services/unsplash";

function CreateShoppingList() {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(
    (state: RootState) => state.auth.user,
  );

  const [name, setName] = useState("");

  const [category, setCategory] = useState("");

  const [notes, setNotes] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError(null);

    if (!user) {
      setError(
        "You must be logged in to create a shopping list.",
      );

      return;
    }

    if (!name.trim()) {
      setError(
        "Please enter a shopping list name.",
      );

      return;
    }

    if (!category.trim()) {
      setError(
        "Please enter a category.",
      );

      return;
    }

    try {
      setSaving(true);

      let unsplashImage = null;

      try {
        unsplashImage =
          await searchUnsplashImage(
            `${name.trim()} ${category.trim()}`,
          );
      } catch (unsplashError) {
        console.error(
          "Unsplash search failed:",
          unsplashError,
        );
      }

      const newShoppingList = {
        userId: user.id,
        name: name.trim(),
        category: category.trim(),
        notes: notes.trim(),
        createdAt:
          new Date().toISOString(),

        imageUrl:
          unsplashImage?.imageUrl,

        unsplashPhotoId:
          unsplashImage?.unsplashPhotoId,

        photographerName:
          unsplashImage?.photographerName,

        photographerProfileUrl:
          unsplashImage?.photographerProfileUrl,
      };

      const createdList =
        await createShoppingList(
          newShoppingList,
        );

      dispatch(
        addShoppingList(createdList),
      );

      navigate("/home");
    } catch {
      setError(
        "Unable to create shopping list. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="form-page">
      <section className="form-card">

        <div className="form-card-header">

          <button
            type="button"
            className="back-button"
            onClick={() =>
              navigate("/home")
            }
          >
            ← Back
          </button>

          <h1>
            Create Shopping List
          </h1>

          <p>
            Create a new list to keep track
            of your shopping.
          </p>

        </div>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form
          className="page-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label htmlFor="name">
              List Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value,
                )
              }
              placeholder="e.g. Weekly Groceries"
              disabled={saving}
            />

          </div>

          <div className="form-group">

            <label htmlFor="category">
              Category
            </label>

            <input
              id="category"
              type="text"
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value,
                )
              }
              placeholder="e.g. Groceries"
              disabled={saving}
            />

          </div>

          <div className="form-group">

            <label htmlFor="notes">
              Notes
            </label>

            <textarea
              id="notes"
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value,
                )
              }
              placeholder="Add any notes for this list..."
              rows={4}
              disabled={saving}
            />

          </div>

          <div className="form-actions">

            <button
              type="button"
              className="button button-secondary"
              onClick={() =>
                navigate("/home")
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button button-primary"
              disabled={saving}
            >
              {saving
                ? "Creating..."
                : "Create List"}
            </button>

          </div>

        </form>

      </section>
    </main>
  );
}

export default CreateShoppingList;