import {useEffect,useMemo,useState,} from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import type { ShoppingItem, ShoppingList as ShoppingListType,} from "../types";
import { setItems,addItem,updateItem,setItemLoading,setItemError,} from "../store/slices/ShoppingItemsSlice";
import {getShoppingList,getShoppingItems,createShoppingItem,updateShoppingItem,} from "../services/api";

function ShoppingList() {
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(
    (state: RootState) => state.auth.user,
  );

  const { items, loading, error } = useSelector(
    (state: RootState) => state.shoppingItems,
  );

  const [shoppingList, setShoppingList] =
    useState<ShoppingListType | null>(null);

  const [listLoading, setListLoading] =
    useState(true);

  const [listError, setListError] =
    useState<string | null>(null);

  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [sortOption, setSortOption] =
    useState("newest");

  /*Load the shopping list and its items*/
  useEffect(() => {
    async function loadData() {
      try {
        setListLoading(true);
        setListError(null);

        dispatch(setItemLoading(true));
        dispatch(setItemError(null));

        if (!id || !user) {
          setListError(
            "Shopping list could not be found.",
          );

          return;
        }

        const list =
          await getShoppingList(id);

        if (list.userId !== user.id) {
          setListError(
            "You do not have access to this shopping list.",
          );

          return;
        }

        setShoppingList(list);

        const shoppingItems =
          await getShoppingItems(id);

        dispatch(setItems(shoppingItems));
      } catch {
        setListError(
          "Unable to load the shopping list.",
        );

        dispatch(
          setItemError(
            "Unable to load shopping items.",
          ),
        );
      } finally {
        setListLoading(false);
        dispatch(setItemLoading(false));
      }
    }

    loadData();
  }, [id, user, dispatch]);

  /*Adding a new shopping item*/
  const handleAddItem = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!itemName.trim()) {
      alert("Please enter an item name.");
      return;
    }

    if (quantity < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    if (!category.trim()) {
      alert("Please enter a category.");
      return;
    }

    if (!id) {
      alert("Shopping list could not be found.");
      return;
    }

    try {
      dispatch(setItemError(null));

      const newItem = {
        listId: id,
        name: itemName.trim(),
        quantity,
        category: category.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };

      const createdItem =
        await createShoppingItem(newItem);

      dispatch(addItem(createdItem));

      setItemName("");
      setQuantity(1);
      setCategory("");
    } catch {
      dispatch(
        setItemError(
          "Unable to add shopping item.",
        ),
      );
    }
  };

  /*complete/incomplete toggle*/
  const handleToggleComplete = async (
    item: ShoppingItem,
  ) => {
    try {
      const updatedItem = {
        ...item,
        completed: !item.completed,
      };

      const savedItem =
        await updateShoppingItem(
          item.id,
          updatedItem,
        );

      dispatch(updateItem(savedItem));
    } catch {
      dispatch(
        setItemError(
          "Unable to update item.",
        ),
      );
    }
  };

  /*Search and sort items*/
  const filteredAndSortedItems =
    useMemo(() => {
      let filteredItems = [...items];

      if (searchTerm.trim()) {
        const search =
          searchTerm.toLowerCase();

        filteredItems =
          filteredItems.filter(
            (item) =>
              item.name
                .toLowerCase()
                .includes(search) ||
              item.category
                .toLowerCase()
                .includes(search),
          );
      }

      if (sortOption === "name") {
        filteredItems.sort((a, b) =>
          a.name.localeCompare(b.name),
        );
      }

      if (sortOption === "category") {
        filteredItems.sort((a, b) =>
          a.category.localeCompare(
            b.category,
          ),
        );
      }

      if (sortOption === "completed") {
        filteredItems.sort(
          (a, b) =>
            Number(a.completed) -
            Number(b.completed),
        );
      }

      if (sortOption === "newest") {
        filteredItems.sort(
          (a, b) =>
            new Date(
              b.createdAt,
            ).getTime() -
            new Date(
              a.createdAt,
            ).getTime(),
        );
      }

      if (sortOption === "oldest") {
        filteredItems.sort(
          (a, b) =>
            new Date(
              a.createdAt,
            ).getTime() -
            new Date(
              b.createdAt,
            ).getTime(),
        );
      }

      return filteredItems;
    }, [items, searchTerm, sortOption]);

  if (listLoading) {
    return (
      <main className="shopping-list-page">
        <p>Loading shopping list...</p>
      </main>
    );
  }

 
  if (listError) {
    return (
      <main className="shopping-list-page">
        <section className="error-state">
          <h1>Something went wrong</h1>

          <p>{listError}</p>

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
          <h1>
            Shopping List Not Found
          </h1>

          <p>
            The shopping list you're looking
            for does not exist.
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

          <h1>
            {shoppingList.name}
          </h1>

          {shoppingList.notes && (
            <p>
              {shoppingList.notes}
            </p>
          )}

        </div>

      </section>

      <section className="add-item-section">

        <div className="section-header">
          <h2>Add Shopping Item</h2>

          <p>
            Add an item to this shopping
            list.
          </p>
        </div>

        <form
          className="add-item-form"
          onSubmit={handleAddItem}
        >

          <div className="form-group">
            <label htmlFor="itemName">
              Item Name
            </label>

            <input
              id="itemName"
              type="text"
              value={itemName}
              onChange={(event) =>
                setItemName(
                  event.target.value,
                )
              }
              placeholder="e.g. Milk"
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">
              Quantity
            </label>

            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(event) =>
                setQuantity(
                  Number(event.target.value),
                )
              }
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
              placeholder="e.g. Dairy"
            />
          </div>

          <button
            type="submit"
            className="button button-primary"
          >
            + Add Item
          </button>

        </form>

      </section>

      <section className="shopping-items-section">

        <div className="section-header">
          <div>
            <h2>
              Shopping Items
            </h2>

            <p>
              {items.length}{" "}
              {items.length === 1
                ? "item"
                : "items"}{" "}
              in this list.
            </p>
          </div>
        </div>

        {/* Search and sorting */}

        {items.length > 0 && (
          <div className="items-toolbar">

            <div className="search-container">
              <label
                htmlFor="searchItems"
              >
                Search
              </label>

              <input
                id="searchItems"
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value,
                  )
                }
                placeholder="Search items..."
              />
            </div>

            <div className="sort-container">
              <label htmlFor="sortItems">
                Sort by
              </label>

              <select
                id="sortItems"
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

                <option value="category">
                  Category
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>
            </div>

          </div>
        )}


        {error && (
          <p className="error-message">
            {error}
          </p>
        )}


        {loading && (
          <p>
            Loading shopping items...
          </p>
        )}


        {!loading &&
          items.length === 0 && (
            <section className="empty-state">
              <div className="empty-state-icon">
                
              </div>

              <h2>
                No items yet
              </h2>

              <p>
                Start adding items to
                your shopping list.
              </p>
            </section>
          )}

        {!loading &&
          items.length > 0 &&
          filteredAndSortedItems.length ===
            0 && (
            <section className="empty-state">
              <h2>
                No items found
              </h2>

              <p>
                Try using a different
                search term.
              </p>
            </section>
          )}


        {!loading &&
          filteredAndSortedItems.length >
            0 && (
            <div className="shopping-items-list">

              {filteredAndSortedItems.map(
                (item) => (
                  <article
                    className={`shopping-item ${
                      item.completed
                        ? "shopping-item-completed"
                        : ""
                    }`}
                    key={item.id}
                  >

                    <div className="shopping-item-check">

                      <input
                        type="checkbox"
                        checked={
                          item.completed
                        }
                        onChange={() =>
                          handleToggleComplete(
                            item,
                          )
                        }
                        aria-label={`Mark ${item.name} as ${
                          item.completed
                            ? "incomplete"
                            : "complete"
                        }`}
                      />

                    </div>

                    <div className="shopping-item-info">

                      <h3>
                        {item.name}
                      </h3>

                      <div className="shopping-item-details">

                        <span>
                          Quantity:{" "}
                          {item.quantity}
                        </span>

                        <span>
                          {item.category}
                        </span>

                      </div>

                    </div>

                    <div className="shopping-item-status">

                      {item.completed ? (
                        <span className="status-complete">
                          Complete
                        </span>
                      ) : (
                        <span className="status-pending">
                          Pending
                        </span>
                      )}

                    </div>

                  </article>
                ),
              )}

            </div>
          )}

      </section>

    </main>
  );
}

export default ShoppingList;