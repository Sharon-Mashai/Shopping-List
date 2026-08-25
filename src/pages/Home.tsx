import { useEffect, useMemo,useState,} from "react";
import {Link,} from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import type { AppDispatch,RootState,} from "../store/store";
import {setShoppingLists,setLoading,setError,} from "../store/slices/ShoppingListSlice";
import { getShoppingLists,} from "../services/api";

function Home() {
  const dispatch =
    useDispatch<AppDispatch>();

  const user = useSelector(
    (state: RootState) =>
      state.auth.user,
  );

  const {
    shoppingLists,
    loading,
    error,
  } = useSelector(
    (state: RootState) =>
      state.shoppingLists,
  );

  const [
    sortOption,
    setSortOption,
  ] = useState("newest");

  useEffect(() => {
    async function loadShoppingLists() {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        if (!user) {
          return;
        }

        const data =
          await getShoppingLists(
            user.id,
          );

        dispatch(
          setShoppingLists(data),
        );
      } catch {
        dispatch(
          setError(
            "Unable to load shopping lists.",
          ),
        );
      } finally {
        dispatch(
          setLoading(false),
        );
      }
    }

    loadShoppingLists();
  }, [dispatch, user]);

  const sortedShoppingLists =
    useMemo(() => {
      const lists = [
        ...shoppingLists,
      ];

      if (
        sortOption === "name"
      ) {
        return lists.sort(
          (a, b) =>
            a.name.localeCompare(
              b.name,
            ),
        );
      }

      if (
        sortOption === "oldest"
      ) {
        return lists.sort(
          (a, b) =>
            new Date(
              a.createdAt,
            ).getTime() -
            new Date(
              b.createdAt,
            ).getTime(),
        );
      }

      return lists.sort(
        (a, b) =>
          new Date(
            b.createdAt,
          ).getTime() -
          new Date(
            a.createdAt,
          ).getTime(),
      );
    }, [
      shoppingLists,
      sortOption,
    ]);

  return (
    <main className="home-page">

      <section className="page-header">

        <div>
          <h1>
            My Shopping Lists
          </h1>

          <p>
            Create and manage your
            shopping lists.
          </p>
        </div>

        <Link
          to="/CreateShoppingList"
          className="button button-primary"
        >
          + Create List
        </Link>

      </section>

      {loading && (
        <p className="loading-message">
          Loading shopping lists...
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        shoppingLists.length ===
          0 && (
          <section className="empty-state">

            <div className="empty-state-icon">
              
            </div>

            <h2>
              Your shopping list is empty
            </h2>

            <p>
              Start by creating your
              first shopping list.
            </p>

            <Link
              to="/create-shopping-list"
              className="button button-primary"
            >
              Create Shopping List
            </Link>

          </section>
        )}

      {!loading &&
        !error &&
        shoppingLists.length >
          0 && (
          <>

            <div className="list-toolbar">

              <label htmlFor="sort">
                Sort by
              </label>

              <select
                id="sort"
                value={sortOption}
                onChange={(event) =>
                  setSortOption(
                    event.target.value,
                  )
                }
              >
                <option value="newest">
                  Newest
                </option>

                <option value="oldest">
                  Oldest
                </option>

                <option value="name">
                  Name
                </option>
              </select>

            </div>

            <section className="shopping-lists">

              {sortedShoppingLists.map(
                (list) => (
                  <article
                    className="shopping-list-card"
                    key={list.id}
                  >

                    <div className="shopping-list-card-content">

                      <span className="shopping-list-category">
                        {list.category}
                      </span>

                      <h2>
                        {list.name}
                      </h2>

                      {list.notes && (
                        <p>
                          {list.notes}
                        </p>
                      )}

                      <Link
                        to={`/ShoppingList/${list.id}`}
                        className="button button-primary"
                      >
                        Open List
                      </Link>

                    </div>

                  </article>
                ),
              )}

            </section>

          </>
        )}

    </main>
  );
}

export default Home;