import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {setShoppingLists, setLoading,setError,deleteShoppingList as deleteShoppingListState,} from "../store/slices/ShoppingListSlice";
import { getShoppingLists, deleteShoppingList } from "../services/api";

function Home() {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);

  const { shoppingLists, loading, error } = useSelector(
    (state: RootState) => state.shoppingLists,
  );

  const [sortOption, setSortOption] = useState("newest");

  const [deletingListId, setDeletingListId] = useState<string | null>(null);

  useEffect(() => {
    async function loadShoppingLists() {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        if (!user) {
          return;
        }

        const data = await getShoppingLists(user.id);

        dispatch(setShoppingLists(data));
      } catch {
        dispatch(setError("Unable to load shopping lists."));
      } finally {
        dispatch(setLoading(false));
      }
    }

    loadShoppingLists();
  }, [dispatch, user]);

  const sortedShoppingLists = useMemo(() => {
    const lists = [...shoppingLists];

    if (sortOption === "name") {
      return lists.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortOption === "oldest") {
      return lists.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }

    return lists.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [shoppingLists, sortOption]);

  const handleDeleteList = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingListId(id);

      await deleteShoppingList(id);

      dispatch(deleteShoppingListState(id));
    } catch {
      dispatch(setError("Unable to delete shopping list."));
    } finally {
      setDeletingListId(null);
    }
  };

  return (
  
    <main className="home-page">
      <div className="home-navigation">
  <Link
    to="/profile"
    className="button button-secondary"
  >
    Profile
  </Link>
</div>
      <section className="page-header">
        <div>
          <h1>My Shopping Lists</h1>

          <p>Create and manage your shopping lists.</p>
        </div>

        <Link to="/create-shopping-list" className="button button-primary">
          + Create List
        </Link>
      </section>

      {loading && <p className="loading-message">Loading shopping lists...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && shoppingLists.length === 0 && (
        <section className="empty-state">
          <div className="empty-state-icon">🛒</div>

          <h2>Your shopping list is empty</h2>

          <p>Start by creating your first shopping list.</p>

          <Link to="/create-shopping-list" className="button button-primary">
            Create Shopping List
          </Link>
        </section>
      )}

      {!loading && !error && shoppingLists.length > 0 && (
        <>
          <div className="list-toolbar">
            <label htmlFor="sort">Sort by</label>

            <select
              id="sort"
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
            >
              <option value="newest">Newest</option>

              <option value="oldest">Oldest</option>

              <option value="name">Name</option>
            </select>
          </div>

          <section className="shopping-lists">
            {sortedShoppingLists.map((list) => (
              <article className="shopping-list-card" key={list.id}>
                <div className="shopping-list-card-content">
                  <span className="shopping-list-category">
                    {list.category}
                  </span>

                  <h2>{list.name}</h2>

                  {list.notes && <p>{list.notes}</p>}

                  <div className="shopping-list-card-actions">
                    <Link
                      to={`/shopping-list/${list.id}`}
                      className="button button-primary"
                    >
                      Open List
                    </Link>

                    <Link
                      to={`/edit-shopping-list/${list.id}`}
                      className="button button-secondary"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      className="button button-danger"
                      onClick={() => handleDeleteList(list.id, list.name)}
                      disabled={deletingListId === list.id}
                    >
                      {deletingListId === list.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}

export default Home;
