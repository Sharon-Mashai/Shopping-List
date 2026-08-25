import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {setShoppingLists,setLoading,setError,} from "../store/slices/ShoppingListSlice";
import { getShoppingLists } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { shoppingLists, loading, error } = useSelector(
    (state: RootState) => state.shoppingLists,
  );

  const user = useSelector(
  (state: RootState) => state.auth.user,
);

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
      dispatch(
        setError("Unable to load shopping lists."),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  loadShoppingLists();
}, [dispatch, user]);

  return (
    <main className="home-page">
      <section className="page-header">
        <div>
          <h1>My Shopping Lists</h1>

          <p>
            Create and manage your shopping lists.
          </p>
        </div>

       <button
          className="button button-primary" onClick={() => navigate("/CreateShoppingList")}>
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

       <button className="button button-primary" onClick={() => navigate("/CreateShoppingList")}>
           Create Shopping List
       </button>

        </section>
      )}

      {!loading && !error && shoppingLists.length > 0 && (

        <section className="shopping-lists">
  {shoppingLists.map((list) => (
    <article
      className="shopping-list-card"
      key={list.id}
    >
      <div className="shopping-list-card-content">
        <span className="shopping-list-category">
          {list.category}
        </span>

        <h2>{list.name}</h2>

        {list.notes && (
          <p>{list.notes}</p>
        )}

        <Link
          to={`/shopping-list/${list.id}`}
          className="button button-primary"
        >
          Open List
        </Link>
      </div>
    </article>
  ))}
</section>
        )}
    </main>
  );
}

export default Home;