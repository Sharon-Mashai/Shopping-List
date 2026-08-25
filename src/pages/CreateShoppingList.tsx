import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../store/store";
import {
  addShoppingList,
  setError,
} from "../store/slices/ShoppingListSlice";
import { createShoppingList } from "../services/api";

function CreateShoppingList() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(
    (state: RootState) => state.auth.user,
  );

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      alert("Please enter a shopping list name.");
      return;
    }

    if (!category.trim()) {
      alert("Please enter a category.");
      return;
    }

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    try {
      setIsSubmitting(true);
      dispatch(setError(null));

      const newShoppingList = {
        userId: user.id,
        name: name.trim(),
        category: category.trim(),
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
      };

      const createdList =
        await createShoppingList(newShoppingList);

      dispatch(addShoppingList(createdList));

      navigate("/home");
    } catch {
      dispatch(
        setError("Unable to create shopping list."),
      );

      alert("Unable to create shopping list.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="create-list-page">
      <section className="form-container">
        <div className="form-header">
          <h1>Create Shopping List</h1>

          <p>
            Create a new list to start adding shopping items.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              List Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="e.g. Weekly Groceries"
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
                setCategory(event.target.value)
              }
              placeholder="e.g. Groceries"
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
                setNotes(event.target.value)
              }
              placeholder="Add optional notes..."
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={() => navigate("/home")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button button-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
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