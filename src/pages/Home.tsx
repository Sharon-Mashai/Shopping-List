import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {setShoppingLists,setLoading,setError,} from "../store/slices/ShoppingListSlice";
import { getShoppingLists } from "../services/api";

function Home() {
  const dispatch = useDispatch<AppDispatch>();

  const { shoppingLists, loading, error } = useSelector(
    (state: RootState) => state.shoppingLists,
  );

  useEffect(() => {
  async function loadShoppingLists() {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data = await getShoppingLists();

      dispatch(setShoppingLists(data));
    } catch {
      dispatch(
        setError("Unable to load shopping lists."),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  loadShoppingLists();
}, [dispatch]);

  return (
    <main className="home-page">
      <section className="page-header">
        <div>
          <h1>My Shopping Lists</h1>

          <p>
            Create and manage your shopping lists.
          </p>
        </div>

        <button className="button button-primary">
          + Create List
        </button>
      </section>

      {loading && (
        <p>Loading shopping lists...</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {!loading && !error && shoppingLists.length === 0 && (
        <section className="empty-state">
          <div className="empty-state-icon">
            
          </div>

          <h2>Your shopping list is empty</h2>

          <p>
            Start by creating your first shopping list.
          </p>

          <button className="button button-primary">
            Create Shopping List
          </button>
        </section>
      )}

      {!loading &&
        !error &&
        shoppingLists.length > 0 && (
          <section className="shopping-lists">
            {shoppingLists.map((list) => (
              <div key={list.id}>
                <h2>{list.name}</h2>
                <p>{list.category}</p>
              </div>
            ))}
          </section>
        )}
    </main>
  );
}

export default Home;