
const API_URL =
  "https://shopping-list-4gol.onrender.com";


export async function getShoppingLists(
  userId?: string,
) {
  const url = userId
    ? `${API_URL}/shoppingLists?userId=${encodeURIComponent(
        userId,
      )}`
    : `${API_URL}/shoppingLists`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Unable to load shopping lists. Status: ${response.status}`,
    );
  }

  return response.json();
}


export async function getShoppingList(
  id: string,
) {
  const response = await fetch(
    `${API_URL}/shoppingLists/${encodeURIComponent(
      id,
    )}`,
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load shopping list. Status: ${response.status}`,
    );
  }

  return response.json();
}


export async function createShoppingList(
  list: object,
) {
  const response = await fetch(
    `${API_URL}/shoppingLists`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(list),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Unable to create shopping list. Status: ${response.status}`,
    );
  }

  return response.json();
}


export async function updateShoppingList(
  id: string,
  list: object,
) {
  const response = await fetch(
    `${API_URL}/shoppingLists/${encodeURIComponent(
      id,
    )}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(list),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Unable to update shopping list. Status: ${response.status}`,
    );
  }

  return response.json();
}


export async function deleteShoppingList(
  id: string,
) {
  const response = await fetch(
    `${API_URL}/shoppingLists/${encodeURIComponent(
      id,
    )}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Unable to delete shopping list. Status: ${response.status}`,
    );
  }
}


export async function getShoppingItems(
  shoppingListId: string,
) {
  const url =
    `${API_URL}/shoppingItems?listId=${encodeURIComponent(
      shoppingListId,
    )}`;

  console.log(
    "Loading shopping items from:",
    url,
  );

  const response = await fetch(url);

  if (!response.ok) {
    console.error(
      "getShoppingItems failed:",
      {
        url,
        status: response.status,
        statusText: response.statusText,
      },
    );

    throw new Error(
      `Unable to load shopping items. Status: ${response.status}`,
    );
  }

  return response.json();
}


export async function getShoppingItem(
  id: string,
) {
  const response = await fetch(
    `${API_URL}/shoppingItems/${encodeURIComponent(
      id,
    )}`,
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load shopping item. Status: ${response.status}`,
    );
  }

  return response.json();
}


export async function createShoppingItem(
  item: object,
) {
  const response = await fetch(
    `${API_URL}/shoppingItems`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Unable to create shopping item. Status: ${response.status}`,
    );
  }

  return response.json();
}


export async function updateShoppingItem(
  id: string,
  item: object,
) {
  const response = await fetch(
    `${API_URL}/shoppingItems/${encodeURIComponent(
      id,
    )}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Unable to update shopping item. Status: ${response.status}`,
    );
  }

  return response.json();
}


export async function deleteShoppingItem(
  id: string,
) {
  const response = await fetch(
    `${API_URL}/shoppingItems/${encodeURIComponent(
      id,
    )}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Unable to delete shopping item. Status: ${response.status}`,
    );
  }
}


export async function createUser(
  user: object,
) {
  const response = await fetch(
    `${API_URL}/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Unable to register user. Status: ${response.status}`,
    );
  }

  return response.json();
}


export async function getUser(
  id: string,
) {
  const response = await fetch(
    `${API_URL}/users/${encodeURIComponent(
      id,
    )}`,
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load user. Status: ${response.status}`,
    );
  }

  return response.json();
}


export async function getUserByEmail(
  email: string,
) {
  const response = await fetch(
    `${API_URL}/users?email=${encodeURIComponent(
      email,
    )}`,
  );

  if (!response.ok) {
    throw new Error(
      `Unable to find user. Status: ${response.status}`,
    );
  }

  return response.json();
}


export async function updateUser(
  id: string,
  user: object,
) {
  const response = await fetch(
    `${API_URL}/users/${encodeURIComponent(
      id,
    )}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Unable to update user. Status: ${response.status}`,
    );
  }

  return response.json();
}


export async function createSharedShoppingList(
  sharedList: object,
) {
  const response = await fetch(
    `${API_URL}/sharedLists`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sharedList),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Unable to share shopping list. Status: ${response.status}`,
    );
  }

  return response.json();
}


export async function deleteSharedShoppingList(
  id: string,
) {
  const response = await fetch(
    `${API_URL}/sharedLists/${encodeURIComponent(
      id,
    )}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Unable to remove shared shopping list. Status: ${response.status}`,
    );
  }
}


export async function updateSharedShoppingList(
  id: string,
  sharedWith: string[],
) {
  const response = await fetch(
    `${API_URL}/shoppingLists/${encodeURIComponent(
      id,
    )}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sharedWith,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Unable to update shared shopping list. Status: ${response.status}`,
    );
  }

  return response.json();
}


export async function getSharedShoppingLists(
  email: string,
) {
  const response = await fetch(
    `${API_URL}/shoppingLists`,
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load shared shopping lists. Status: ${response.status}`,
    );
  }

  const lists =
    await response.json();

  return lists.filter(
    (list: {
      sharedWith?: string[];
    }) =>
      list.sharedWith?.some(
        (sharedEmail: string) =>
          sharedEmail
            .toLowerCase() ===
          email.toLowerCase(),
      ),
  );
}
