
const API_URL = "https://shopping-list-4gol.onrender.com";


export async function getShoppingLists(
  userId?: string,
) {
  const url = userId
    ? `${API_URL}/shoppingLists?userId=${userId}`
    : `${API_URL}/shoppingLists`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Unable to load shopping lists.",
    );
  }

  return response.json();
}


export async function getShoppingList(
  id: string,
) {
  const response = await fetch(
    `${API_URL}/shoppingLists/${id}`,
  );

  if (!response.ok) {
    throw new Error(
      "Unable to load shopping list.",
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
      "Unable to create shopping list.",
    );
  }

  return response.json();
}


export async function updateShoppingList(
  id: string,
  list: object,
) {
  const response = await fetch(
    `${API_URL}/shoppingLists/${id}`,
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
      "Unable to update shopping list.",
    );
  }

  return response.json();
}


export async function deleteShoppingList(
  id: string,
) {
  const response = await fetch(
    `${API_URL}/shoppingLists/${id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Unable to delete shopping list.",
    );
  }
}



export async function getShoppingItems(
  shoppingListId: string,
) {
  const response = await fetch(
    `${API_URL}/shoppingItems?listId=${shoppingListId}`,
  );

  if (!response.ok) {
    throw new Error(
      "Unable to load shopping items.",
    );
  }

  return response.json();
}


export async function getShoppingItem(
  id: string,
) {
  const response = await fetch(
    `${API_URL}/shoppingItems/${id}`,
  );

  if (!response.ok) {
    throw new Error(
      "Unable to load shopping item.",
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
      "Unable to create shopping item.",
    );
  }

  return response.json();
}


export async function updateShoppingItem(
  id: string,
  item: object,
) {
  const response = await fetch(
    `${API_URL}/shoppingItems/${id}`,
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
      "Unable to update shopping item.",
    );
  }

  return response.json();
}


export async function deleteShoppingItem(
  id: string,
) {
  const response = await fetch(
    `${API_URL}/shoppingItems/${id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Unable to delete shopping item.",
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
      "Unable to register user.",
    );
  }

  return response.json();
}


export async function getUser(
  id: string,
) {
  const response = await fetch(
    `${API_URL}/users/${id}`,
  );

  if (!response.ok) {
    throw new Error(
      "Unable to load user.",
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
      "Unable to find user.",
    );
  }

  return response.json();
}


export async function updateUser(
  id: string,
  user: object,
) {
  const response = await fetch(
    `${API_URL}/users/${id}`,
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
      "Unable to update user.",
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
      "Unable to share shopping list.",
    );
  }

  return response.json();
}


export async function deleteSharedShoppingList(
  id: string,
) {
  const response = await fetch(
    `${API_URL}/sharedLists/${id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Unable to remove shared shopping list.",
    );
  }
}


export async function updateSharedShoppingList(
  id: string,
  sharedWith: string[],
) {
  const response = await fetch(
    `${API_URL}/shoppingLists/${id}`,
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
      "Unable to update shared shopping list.",
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
      "Unable to load shared shopping lists.",
    );
  }

  const lists = await response.json();

  return lists.filter(
    (list: {
      sharedWith?: string[];
    }) =>
      list.sharedWith?.some(
        (sharedEmail) =>
          sharedEmail.toLowerCase() ===
          email.toLowerCase(),
      ),
  );
}
