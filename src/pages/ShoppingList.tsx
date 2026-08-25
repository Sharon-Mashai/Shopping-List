import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../store/store";
import type { ShoppingList as ShoppingListType } from "../types";

function ShoppingList() {
  const { id } = useParams<{ id: string }>();

  const user = useSelector(
    (state: RootState) => state.auth.user,
  );

  const [shoppingList, setShoppingList] =
    useState<ShoppingListType | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadShoppingList() {
      try {
        setLoading(true);
        setError(null);

        if (!id || !user) {
          setError("Shopping list could not be found.");
          return;
        }

        const response = await fetch(
          `http://localhost:3000/shoppingLists/${id}`,
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load shopping list.",
          );
        }

        const data: ShoppingListType = await response.json();

        if (data.userId !== user.id) {
          setError(
            "You do not have access to this shopping list.",
          );
          return;
        }

        setShoppingList(data);
      } catch {
        setError(
          "Unable to load the shopping list.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadShoppingList();
  }, [id, user]);

  if (loading) {
    return (
      <main className="shopping-list-page">
        <p>Loading shopping list...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="shopping-list-page">
        <section className="error-state">
          <h1>Something went wrong</h1>

          <p>{error}</p>

          <Link
            to="/home"
            className="button button-primary"
          >
            Back to Shopping Lists
          </Link>
        </section>
      </main>
    );
  }

  if (!shoppingList) {
    return (
      <main className="shopping-list-page">
        <section className="empty-state">
          <h1>Shopping List Not Found</h1>

          <p>
            The shopping list you're looking for
            does not exist.
          </p>

          <Link
            to="/home"
            className="button button-primary"
          >
            Back to Shopping Lists
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="shopping-list-page">
      <section className="shopping-list-header">

        <Link
          to="/home"
          className="back-link"
        >
          ← Back to Shopping Lists
        </Link>

        <div className="shopping-list-heading">
          <span className="shopping-list-category">
            {shoppingList.category}
          </span>

          <h1>{shoppingList.name}</h1>

          {shoppingList.notes && (
            <p>{shoppingList.notes}</p>
          )}
        </div>

      </section>

      <section className="shopping-items-section">

        <div className="section-header">
          <div>
            <h2>Shopping Items</h2>

            <p>
              Add and manage the items in this list.
            </p>
          </div>
        </div>

        <div className="empty-state">
          <div className="empty-state-icon">
            🛒
          </div>

          <h2>No items yet</h2>

          <p>
            Start adding items to your shopping list.
          </p>

          <button
            type="button"
            className="button button-primary"
          >
            + Add Item
          </button>
        </div>

      </section>
    </main>
  );
}

export default ShoppingList;