const API_URL =
  "http://localhost:3000";


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
    `${API_URL}/shoppingItems?shoppingListId=${shoppingListId}`,
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