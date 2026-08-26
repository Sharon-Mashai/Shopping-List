import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HugeiconsIcon } from "@hugeicons/react";
import {ListViewIcon,ShoppingBasket01Icon,ShoppingCart01Icon,Tick01Icon,Add01Icon,FileEmpty02Icon,} from "@hugeicons/core-free-icons";
import type { AppDispatch, RootState } from "../store/store";
import type { ShoppingItem, ShoppingList as ShoppingListType } from "../types";
import {setShoppingLists,setLoading,setError,deleteShoppingList as deleteShoppingListState,} from "../store/slices/ShoppingListSlice";
import {getShoppingLists,getShoppingItems,deleteShoppingList,} from "../services/api";

type ListStats = {
  total: number;
  completed: number;
};

function Home() {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth.user);

  const { shoppingLists, loading, error } = useSelector(
    (state: RootState) => state.shoppingLists,
  );

  const [sortOption, setSortOption] = useState("newest");

  const [deletingListId, setDeletingListId] = useState<string | null>(null);

  const [listStats, setListStats] = useState<Record<string, ListStats>>({});

  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    async function loadShoppingLists() {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        if (!user) {
          return;
        }

        const data: ShoppingListType[] = await getShoppingLists(user.id);

        dispatch(setShoppingLists(data));

        setStatsLoading(true);

        const statsEntries = await Promise.all(
          data.map(async (list: ShoppingListType) => {
            try {
              const items: ShoppingItem[] = await getShoppingItems(list.id);

              return [
                list.id,
                {
                  total: items.length,
                  completed: items.filter(
                    (item: ShoppingItem) => item.completed,
                  ).length,
                },
              ] as const;
            } catch {
              return [
                list.id,
                {
                  total: 0,
                  completed: 0,
                },
              ] as const;
            }
          }),
        );

        setListStats(Object.fromEntries(statsEntries));
      } catch {
        dispatch(setError("Unable to load shopping lists."));
      } finally {
        dispatch(setLoading(false));
        setStatsLoading(false);
      }
    }

    loadShoppingLists();
  }, [dispatch, user]);

  const sortedShoppingLists = useMemo(() => {
    const lists = [...shoppingLists];

    if (sortOption === "name") {
      return lists.sort((a: ShoppingListType, b: ShoppingListType) =>
        a.name.localeCompare(b.name),
      );
    }

    if (sortOption === "oldest") {
      return lists.sort(
        (a: ShoppingListType, b: ShoppingListType) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }

    return lists.sort(
      (a: ShoppingListType, b: ShoppingListType) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [shoppingLists, sortOption]);

  const totalItems = Object.values(listStats).reduce(
    (total: number, stats: ListStats) => total + stats.total,
    0,
  );

  const purchasedItems = Object.values(listStats).reduce(
    (total: number, stats: ListStats) => total + stats.completed,
    0,
  );

  const itemsToBuy = totalItems - purchasedItems;

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

      setListStats((currentStats: Record<string, ListStats>) => {
        const updatedStats = {
          ...currentStats,
        };

        delete updatedStats[id];

        return updatedStats;
      });
    } catch {
      dispatch(setError("Unable to delete shopping list."));
    } finally {
      setDeletingListId(null);
    }
  };

  const getListStats = (listId: string): ListStats => {
    return (
      listStats[listId] || {
        total: 0,
        completed: 0,
      }
    );
  };

  const getProgress = (listId: string): number => {
    const stats = getListStats(listId);

    if (stats.total === 0) {
      return 0;
    }

    return Math.round((stats.completed / stats.total) * 100);
  };

  const getRemaining = (listId: string): number => {
    const stats = getListStats(listId);

    return stats.total - stats.completed;
  };

  const getUpdatedText = (createdAt: string): string => {
    const createdDate = new Date(createdAt);

    const now = new Date();

    const difference = now.getTime() - createdDate.getTime();

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return "Created today";
    }

    if (days === 1) {
      return "Created yesterday";
    }

    return `Created ${days} days ago`;
  };

  return (
    <main className="home-page">
      <section className="home-header">
        <div>
          <h1>Welcome back, {user?.name || "there"}!</h1>

          <p>Stay organised and never forget an item again.</p>
        </div>

        <Link
          to="/create-shopping-list"
          className="button button-primary home-create-button"
        >
          <HugeiconsIcon icon={Add01Icon} size={18} />

          <span>Create New List</span>
        </Link>
      </section>

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <HugeiconsIcon icon={ListViewIcon} size={26} />
            </div>

            <div>
              <span>My Lists</span>

              <strong>{shoppingLists.length}</strong>

              <small>Total shopping lists</small>
            </div>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <HugeiconsIcon icon={ShoppingBasket01Icon} size={26} />
            </div>

            <div>
              <span>Items</span>

              <strong>{statsLoading ? "..." : totalItems}</strong>

              <small>Total items</small>
            </div>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <HugeiconsIcon icon={ShoppingCart01Icon} size={26} />
            </div>

            <div>
              <span>To Buy</span>

              <strong>{statsLoading ? "..." : itemsToBuy}</strong>

              <small>Items remaining</small>
            </div>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <HugeiconsIcon icon={Tick01Icon} size={26} />
            </div>

            <div>
              <span>Purchased</span>

              <strong>{statsLoading ? "..." : purchasedItems}</strong>

              <small>Items bought</small>
            </div>
          </article>
        </section>
      )}

      {!loading && !error && shoppingLists.length === 0 && (
        <section className="empty-state home-empty-state">
          <div className="empty-state-icon">
            <HugeiconsIcon icon={FileEmpty02Icon} size={42} />
          </div>

          <h2>Your shopping list is empty</h2>

          <p>Start by creating your first shopping list.</p>

          <Link to="/create-shopping-list" className="button button-primary">
            <HugeiconsIcon icon={Add01Icon} size={18} />

            <span>Create Shopping List</span>
          </Link>
        </section>
      )}

      {!loading && !error && shoppingLists.length > 0 && (
        <section className="home-shopping-section">
          <div className="home-section-header">
            <div>
              <h2>Your Shopping Lists</h2>

              <p>Keep track of what you need to buy.</p>
            </div>

            <div className="home-sort">
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
          </div>

          <div className="home-shopping-lists">
            {sortedShoppingLists.map((list: ShoppingListType) => {
              const stats = getListStats(list.id);

              const progress = getProgress(list.id);

              const remaining = getRemaining(list.id);

              return (
                <article className="home-shopping-card" key={list.id}>
                  <div className="home-shopping-card-top">
                    <div className="home-shopping-card-image">
                      {list.imageUrl ? (
                        <img src={list.imageUrl} alt={list.name} />
                      ) : (
                        <div className="home-shopping-card-icon">
                          <HugeiconsIcon
                            icon={ShoppingBasket01Icon}
                            size={25}
                          />
                        </div>
                      )}
                    </div>

                    <div className="home-shopping-card-info">
                      <span className="shopping-list-category">
                        {list.category}
                      </span>

                      <h3>{list.name}</h3>

                      <p className="home-list-date">
                        {getUpdatedText(list.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`remaining-badge ${
                        remaining === 0 ? "remaining-complete" : ""
                      }`}
                    >
                      {remaining === 0 ? "Completed" : `${remaining} remaining`}
                    </span>
                  </div>

                  {list.notes && (
                    <p className="home-list-notes">{list.notes}</p>
                  )}

                  <div className="home-progress-area">
                    <div className="home-progress-header">
                      <span>
                        {stats.completed} of {stats.total} items bought
                      </span>

                      <strong>{progress}%</strong>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="home-card-actions">
                    <Link
                      to={`/shopping-list/${list.id}`}
                      className="button button-primary"
                    >
                      <span>Open List</span>
                    </Link>

                    <Link
                      to={`/edit-shopping-list/${list.id}`}
                      className="button button-secondary"
                    >
                      <span>Edit</span>
                    </Link>

                    <button
                      type="button"
                      className="button button-danger"
                      onClick={() => handleDeleteList(list.id, list.name)}
                      disabled={deletingListId === list.id}
                    >
                      <span>
                        {deletingListId === list.id ? "Deleting..." : "Delete"}
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {loading && (
        <p className="loading-message">Loading your shopping lists...</p>
      )}
    </main>
  );
}

export default Home;
