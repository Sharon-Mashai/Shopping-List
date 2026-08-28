
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HugeiconsIcon } from "@hugeicons/react";
import { ListViewIcon, ShoppingBasket01Icon, ShoppingCart01Icon, Tick01Icon, Delete02Icon, AlertCircleIcon, Share01Icon, ClipboardListIcon } from "@hugeicons/core-free-icons";
import type {AppDispatch, RootState,} from "../store/store";
import type { ShoppingItem, ShoppingList as ShoppingListType,} from "../types";
import { setShoppingLists, setLoading, setError, deleteShoppingList as deleteShoppingListState, updateShoppingList as updateShoppingListState,} from "../store/slices/ShoppingListSlice";
import { getShoppingLists, getSharedShoppingLists, getShoppingItems, deleteShoppingList, updateSharedShoppingList,} from "../services/api";
import useToast from "../hooks/useToast";
import emptyShoppingListImage from "../assets/EmptyStateImage.png";

type ListStats = {
  total: number;
  completed: number;
};

function Home() {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(
    (state: RootState) => state.auth.user,
  );

  const {
    shoppingLists,
    loading,
    error,
  } = useSelector(
    (state: RootState) =>
      state.shoppingLists,
  );

  const { showToast } = useToast();

  const [sortOption, setSortOption] =
    useState("newest");

  const [
    deletingListId,
    setDeletingListId,
  ] = useState<string | null>(null);

  const [
    deleteTarget,
    setDeleteTarget,
  ] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [
    listStats,
    setListStats,
  ] = useState<
    Record<string, ListStats>
  >({});

  const [
    statsLoading,
    setStatsLoading,
  ] = useState(false);

  const [
    selectedLists,
    setSelectedLists,
  ] = useState<string[]>([]);

  const [
    showShareModal,
    setShowShareModal,
  ] = useState(false);

  const [
    shareEmail,
    setShareEmail,
  ] = useState("");

  const [
    shareError,
    setShareError,
  ] = useState<string | null>(null);

  const [
    sharing,
    setSharing,
  ] = useState(false);

  useEffect(() => {
    async function loadShoppingLists() {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        if (!user) {
          return;
        }

        const ownLists: ShoppingListType[] =
          await getShoppingLists(user.id);

        const sharedLists: ShoppingListType[] =
          await getSharedShoppingLists(
            user.email,
          );

        const combinedLists = [
          ...ownLists,
          ...sharedLists,
        ].filter(
          (list, index, array) =>
            array.findIndex(
              (item) =>
                item.id === list.id,
            ) === index,
        );

        dispatch(
          setShoppingLists(
            combinedLists,
          ),
        );

      
        if (combinedLists.length > 0) {
          setStatsLoading(true);

          const statsEntries =
            await Promise.all(
              combinedLists.map(
                async (
                  list: ShoppingListType,
                ) => {
                  try {
                    const items: ShoppingItem[] =
                      await getShoppingItems(
                        list.id,
                      );

                    return [
                      list.id,
                      {
                        total:
                          items.length,
                        completed:
                          items.filter(
                            (
                              item: ShoppingItem,
                            ) =>
                              item.completed,
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
                },
              ),
            );

          setListStats(
            Object.fromEntries(
              statsEntries,
            ),
          );
        } else {
          
          setListStats({});
        }
      } catch {
        dispatch(
          setError(
            "Unable to load shopping lists.",
          ),
        );
      } finally {
        dispatch(setLoading(false));
        setStatsLoading(false);
      }
    }

    loadShoppingLists();
  }, [dispatch, user]);

  const sortedShoppingLists =
    useMemo(() => {
      const lists = [
        ...shoppingLists,
      ];

      if (sortOption === "name") {
        return lists.sort(
          (
            a: ShoppingListType,
            b: ShoppingListType,
          ) =>
            a.name.localeCompare(
              b.name,
            ),
        );
      }

      if (sortOption === "oldest") {
        return lists.sort(
          (
            a: ShoppingListType,
            b: ShoppingListType,
          ) =>
            new Date(
              a.createdAt,
            ).getTime() -
            new Date(
              b.createdAt,
            ).getTime(),
        );
      }

      return lists.sort(
        (
          a: ShoppingListType,
          b: ShoppingListType,
        ) =>
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

  const totalItems =
    Object.values(listStats).reduce(
      (
        total: number,
        stats: ListStats,
      ) =>
        total + stats.total,
      0,
    );

  const purchasedItems =
    Object.values(listStats).reduce(
      (
        total: number,
        stats: ListStats,
      ) =>
        total + stats.completed,
      0,
    );

  const itemsToBuy =
    totalItems - purchasedItems;

  
  const handleSelectList = (
    id: string,
  ) => {
    setSelectedLists(
      (current) =>
        current.includes(id)
          ? current.filter(
              (listId) =>
                listId !== id,
            )
          : [
              ...current,
              id,
            ],
    );
  };

  /*
   * Select all shopping lists owned
   * by the current user.
   */
  const handleSelectAll = () => {
    const ownListIds =
      shoppingLists
        .filter(
          (list) =>
            list.userId ===
            user?.id,
        )
        .map(
          (list) => list.id,
        );

    if (
      ownListIds.length === 0
    ) {
      return;
    }

    const allSelected =
      ownListIds.every(
        (id) =>
          selectedLists.includes(
            id,
          ),
      );

    if (allSelected) {
      setSelectedLists([]);
    } else {
      setSelectedLists(
        ownListIds,
      );
    }
  };

  /*
   * Open the share modal.
   */
  const handleOpenShare = () => {
    if (
      selectedLists.length === 0
    ) {
      showToast(
        "Please select at least one shopping list.",
        "warning",
      );

      return;
    }

    setShareEmail("");
    setShareError(null);
    setShowShareModal(true);
  };

  /*
   * Share all selected lists with
   * the entered email address.
   */
  const handleShare = async () => {
    setShareError(null);

    const email =
      shareEmail
        .trim()
        .toLowerCase();

    if (!email) {
      setShareError(
        "Please enter an email address.",
      );

      return;
    }

    if (!email.includes("@")) {
      setShareError(
        "Please enter a valid email address.",
      );

      return;
    }

    if (
      selectedLists.length === 0
    ) {
      setShareError(
        "Please select at least one shopping list.",
      );

      return;
    }

    if (!user) {
      setShareError(
        "You must be logged in to share shopping lists.",
      );

      return;
    }

    /*
     * Only lists belonging to the
     * current user can be shared.
     */
    const listsToShare =
      shoppingLists.filter(
        (list) =>
          selectedLists.includes(
            list.id,
          ) &&
          list.userId === user.id,
      );

    if (
      listsToShare.length === 0
    ) {
      setShareError(
        "You can only share shopping lists that you own.",
      );

      return;
    }

    if (
      email ===
      user.email.toLowerCase()
    ) {
      setShareError(
        "You cannot share a shopping list with yourself.",
      );

      return;
    }

    try {
      setSharing(true);

      let sharedCount = 0;

      for (const list of listsToShare) {
        /*
         * sharedWith is expected to be an
         * array of email addresses.
         */
        const existingSharedWith =
          list.sharedWith || [];

        const alreadyShared =
          existingSharedWith.some(
            (sharedEmail) =>
              sharedEmail
                .toLowerCase() ===
              email,
          );

        if (alreadyShared) {
          continue;
        }

        const updatedList =
          await updateSharedShoppingList(
            list.id,
            [
              ...existingSharedWith,
              email,
            ],
          );

        dispatch(
          updateShoppingListState(
            updatedList,
          ),
        );

        sharedCount++;
      }

      setShowShareModal(false);
      setSelectedLists([]);
      setShareEmail("");

      if (sharedCount === 0) {
        showToast(
          `The selected ${
            listsToShare.length === 1
              ? "list has"
              : "lists have"
          } already been shared with this user.`,
          "warning",
        );
      } else {
        showToast(
          `${sharedCount} ${
            sharedCount === 1
              ? "shopping list"
              : "shopping lists"
          } shared successfully.`,
          "success",
        );
      }
    } catch (error) {
      console.error(error);

      setShareError(
        "Unable to share the shopping lists.",
      );
    } finally {
      setSharing(false);
    }
  };

  /*
   * Open delete confirmation modal.
   */
  const handleDeleteList = (
    id: string,
    name: string,
  ) => {
    setDeleteTarget({
      id,
      name,
    });
  };

  /*
   * Delete shopping list.
   */
  const confirmDeleteList =
    async () => {
      if (!deleteTarget) {
        return;
      }

      const {
        id,
        name,
      } = deleteTarget;

      try {
        setDeletingListId(id);

        await deleteShoppingList(
          id,
        );

        dispatch(
          deleteShoppingListState(
            id,
          ),
        );

        setListStats(
          (
            currentStats,
          ) => {
            const updatedStats = {
              ...currentStats,
            };

            delete updatedStats[id];

            return updatedStats;
          },
        );

        /*
         * Also remove the deleted list
         * from the selected lists.
         */
        setSelectedLists(
          (current) =>
            current.filter(
              (listId) =>
                listId !== id,
            ),
        );

        setDeleteTarget(null);

        showToast(
          `"${name}" deleted successfully.`,
          "success",
        );
      } catch (error) {
        console.error(error);

        const message =
          "Unable to delete shopping list.";

        dispatch(
          setError(message),
        );

        showToast(
          message,
          "error",
        );
      } finally {
        setDeletingListId(null);
      }
    };

  const getListStats = (
    listId: string,
  ): ListStats => {
    return (
      listStats[listId] || {
        total: 0,
        completed: 0,
      }
    );
  };

  const getProgress = (
    listId: string,
  ): number => {
    const stats =
      getListStats(listId);

    if (stats.total === 0) {
      return 0;
    }

    return Math.round(
      (stats.completed /
        stats.total) *
        100,
    );
  };

  const getRemaining = (
    listId: string,
  ): number => {
    const stats =
      getListStats(listId);

    return (
      stats.total -
      stats.completed
    );
  };

  const getUpdatedText = (
    createdAt: string,
  ): string => {
    const createdDate =
      new Date(createdAt);

    const now = new Date();

    const difference =
      now.getTime() -
      createdDate.getTime();

    const days = Math.floor(
      difference /
        (1000 *
          60 *
          60 *
          24),
    );

    if (days === 0) {
      return "Created today";
    }

    if (days === 1) {
      return "Created yesterday";
    }

    return `Created ${days} days ago`;
  };


  const ownedLists =
    shoppingLists.filter(
      (list) =>
        list.userId ===
        user?.id,
    );

  const allOwnedSelected =
    ownedLists.length > 0 &&
    ownedLists.every(
      (list) =>
        selectedLists.includes(
          list.id,
        ),
    );

  return (
    <main className="home-page">
      <section className="home-header">
        <div>
          <h1>
           Listie  <HugeiconsIcon
            icon={ClipboardListIcon }
            size={25}
          />
          </h1>

          <p>
            Stay organised and never
            forget an item again.
          </p>
        </div>

        <Link
          to="/create-shopping-list"
          className="button button-primary home-create-button"
        >
  
          <span>
            Create New List
          </span>
        </Link>
      </section>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

  
      {!loading &&
        !error &&
        shoppingLists.length >
          0 && (
          <section className="dashboard-stats">
            <article className="dashboard-stat-card">
              <div className="dashboard-stat-icon">
                <HugeiconsIcon
                  icon={ListViewIcon}
                  size={26}
                />
              </div>

              <div>
                <span>
                  My Lists
                </span>

                <strong>
                  {shoppingLists.length}
                </strong>

                <small>
                  Total shopping lists
                </small>
              </div>
            </article>

            <article className="dashboard-stat-card">
              <div className="dashboard-stat-icon">
                <HugeiconsIcon
                  icon={
                    ShoppingBasket01Icon
                  }
                  size={26}
                />
              </div>

              <div>
                <span>
                  Items
                </span>

                <strong>
                  {statsLoading
                    ? "..."
                    : totalItems}
                </strong>

                <small>
                  Total items
                </small>
              </div>
            </article>

            <article className="dashboard-stat-card">
              <div className="dashboard-stat-icon">
                <HugeiconsIcon
                  icon={
                    ShoppingCart01Icon
                  }
                  size={26}
                />
              </div>

              <div>
                <span>
                  To Buy
                </span>

                <strong>
                  {statsLoading
                    ? "..."
                    : itemsToBuy}
                </strong>

                <small>
                  Items remaining
                </small>
              </div>
            </article>

            <article className="dashboard-stat-card">
              <div className="dashboard-stat-icon">
                <HugeiconsIcon
                  icon={Tick01Icon}
                  size={26}
                />
              </div>

              <div>
                <span>
                  Purchased
                </span>

                <strong>
                  {statsLoading
                    ? "..."
                    : purchasedItems}
                </strong>

                <small>
                  Items bought
                </small>
              </div>
            </article>
          </section>
        )}


      {!loading &&
        !error &&
        shoppingLists.length ===
          0 && (
          <section className="home-empty-state">
            <img
              src={
                emptyShoppingListImage
              }
              alt="No shopping lists"
              className="empty-shopping-list-image"
            />

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
           

              <span>
                Create Shopping List
              </span>
            </Link>
          </section>
        )}

      {!loading &&
        !error &&
        shoppingLists.length >
          0 && (
          <section className="home-shopping-section">
            <div className="home-section-header">
              <div>
                <h2>
                  Your Shopping Lists
                </h2>

                <p>
                  Keep track of what
                  you need to buy.
                </p>
              </div>

              <div className="home-sort">
                <label htmlFor="sort">
                  Sort by
                </label>

                <select
                  id="sort"
                  value={sortOption}
                  onChange={(
                    event,
                  ) =>
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
            </div>

            {/*
             * MULTIPLE LIST SELECTION
             */}
            <div className="shopping-list-selection-toolbar">
              <label className="shopping-list-select-all">
                <input
                  type="checkbox"
                  checked={
                    allOwnedSelected
                  }
                  onChange={
                    handleSelectAll
                  }
                />

                <span>
                  Select all my lists
                </span>
              </label>

              {selectedLists.length >
                0 && (
                <button
                  type="button"
                  className="button button-primary"
                  onClick={
                    handleOpenShare
                  }
                >
                  <HugeiconsIcon
                    icon={
                      Share01Icon
                    }
                    size={18}
                  />

                  <span>
                    Share Selected (
                    {
                      selectedLists.length
                    }
                    )
                  </span>
                </button>
              )}
            </div>

            <div className="home-shopping-lists">
              {sortedShoppingLists.map(
                (
                  list: ShoppingListType,
                ) => {
                  const stats =
                    getListStats(
                      list.id,
                    );

                  const progress =
                    getProgress(
                      list.id,
                    );

                  const remaining =
                    getRemaining(
                      list.id,
                    );

                  const isOwner =
                    list.userId ===
                    user?.id;

                  const isSelected =
                    selectedLists.includes(
                      list.id,
                    );

                  return (
                    <article
                      className={`home-shopping-card ${
                        isSelected
                          ? "home-shopping-card-selected"
                          : ""
                      }`}
                      key={list.id}
                    >
                      <div className="home-shopping-card-top">
                        {/*
                         * Selection checkbox
                         *
                         * Shared lists cannot
                         * be selected.
                         */}
                        <div className="shopping-list-checkbox">
                          <input
                            type="checkbox"
                            checked={
                              isSelected
                            }
                            disabled={
                              !isOwner
                            }
                            onChange={() =>
                              handleSelectList(
                                list.id,
                              )
                            }
                            aria-label={`Select ${list.name} for sharing`}
                          />
                        </div>

                        <div className="home-shopping-card-image">
                          {list.imageUrl ? (
                            <img
                              src={
                                list.imageUrl
                              }
                              alt={
                                list.name
                              }
                            />
                          ) : (
                            <div className="home-shopping-card-icon">
                              <HugeiconsIcon
                                icon={
                                  ShoppingBasket01Icon
                                }
                                size={25}
                              />
                            </div>
                          )}
                        </div>

                        <div className="home-shopping-card-info">
                          <span className="shopping-list-category">
                            {
                              list.category
                            }
                          </span>

                          <h3>
                            {list.name}
                          </h3>

                          <p className="home-list-date">
                            {getUpdatedText(
                              list.createdAt,
                            )}
                          </p>

                          {!isOwner && (
                            <span className="shared-list-label">
                              Shared with you
                            </span>
                          )}
                        </div>

                        <span
                          className={`remaining-badge ${
                            remaining ===
                            0
                              ? "remaining-complete"
                              : ""
                          }`}
                        >
                          {remaining ===
                          0
                            ? "Completed"
                            : `${remaining} remaining`}
                        </span>
                      </div>

                      {list.notes && (
                        <p className="home-list-notes">
                          {list.notes}
                        </p>
                      )}

                      <div className="home-progress-area">
                        <div className="home-progress-header">
                          <span>
                            {
                              stats.completed
                            }{" "}
                            of{" "}
                            {
                              stats.total
                            }{" "}
                            items bought
                          </span>

                          <strong>
                            {progress}%
                          </strong>
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
                          <span>
                            Open List
                          </span>
                        </Link>

                        {isOwner && (
                          <>
                            <Link
                              to={`/edit-shopping-list/${list.id}`}
                              className="button button-secondary"
                            >
                              <span>
                                Edit
                              </span>
                            </Link>

                            <button
                              type="button"
                              className="button button-danger"
                              onClick={() =>
                                handleDeleteList(
                                  list.id,
                                  list.name,
                                )
                              }
                              disabled={
                                deletingListId ===
                                list.id
                              }
                            >
                              <span>
                                {deletingListId ===
                                list.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </span>
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          </section>
        )}

      {loading && (
        <p className="loading-message">
          Loading your shopping lists...
        </p>
      )}

      {/*
       * DELETE MODAL
       */}
      {deleteTarget && (
        <div
          className="modal-overlay"
          onClick={() => {
            if (
              !deletingListId
            ) {
              setDeleteTarget(
                null,
              );
            }
          }}
        >
          <section
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            onClick={(
              event,
            ) =>
              event.stopPropagation()
            }
          >
            <div className="delete-modal-icon">
              <HugeiconsIcon
                icon={
                  AlertCircleIcon
                }
                size={28}
              />
            </div>

            <div className="delete-modal-content">
              <h2 id="delete-modal-title">
                Delete Shopping List?
              </h2>

              <p>
                Are you sure you want
                to delete{" "}
                <strong>
                  "
                  {
                    deleteTarget.name
                  }
                  "
                </strong>
                ?
              </p>

              <span>
                This action cannot be
                undone.
              </span>
            </div>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() =>
                  setDeleteTarget(
                    null,
                  )
                }
                disabled={Boolean(
                  deletingListId,
                )}
              >
                Cancel
              </button>

              <button
                type="button"
                className="button button-danger"
                onClick={
                  confirmDeleteList
                }
                disabled={Boolean(
                  deletingListId,
                )}
              >
                <HugeiconsIcon
                  icon={Delete02Icon}
                  size={18}
                />

                <span>
                  {deletingListId
                    ? "Deleting..."
                    : "Delete List"}
                </span>
              </button>
            </div>
          </section>
        </div>
      )}

      {/*
       * SHARE MODAL
       */}
      {showShareModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            if (!sharing) {
              setShowShareModal(
                false,
              );
            }
          }}
        >
          <section
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
            onClick={(
              event,
            ) =>
              event.stopPropagation()
            }
          >
            <div className="delete-modal-icon">
              <HugeiconsIcon
                icon={Share01Icon}
                size={28}
              />
            </div>

            <div className="delete-modal-content">
              <h2 id="share-modal-title">
                Share Shopping Lists
              </h2>

              <p>
                You are sharing{" "}
                <strong>
                  {
                    selectedLists.length
                  }{" "}
                  {selectedLists.length ===
                  1
                    ? "list"
                    : "lists"}
                </strong>
                .
              </p>

              <span>
                Enter the email address
                of the person you want
                to share these lists
                with.
              </span>

              <div className="form-group share-email-group">
                <label htmlFor="shareEmail">
                  Email Address
                </label>

                <input
                  id="shareEmail"
                  type="email"
                  value={
                    shareEmail
                  }
                  onChange={(
                    event,
                  ) => {
                    setShareEmail(
                      event.target
                        .value,
                    );

                    setShareError(
                      null,
                    );
                  }}
                  placeholder="Enter email address"
                  disabled={
                    sharing
                  }
                />

                {shareError && (
                  <div className="form-error">
                    {
                      shareError
                    }
                  </div>
                )}
              </div>
            </div>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() =>
                  setShowShareModal(
                    false,
                  )
                }
                disabled={
                  sharing
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="button button-primary"
                onClick={
                  handleShare
                }
                disabled={
                  sharing
                }
              >
                <HugeiconsIcon
                  icon={Share01Icon}
                  size={18}
                />

                <span>
                  {sharing
                    ? "Sharing..."
                    : "Share"}
                </span>
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Home;
