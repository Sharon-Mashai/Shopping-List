const API_URL = "http://localhost:3000";

export async function getShoppingLists(userId: string) {
  const response = await fetch(
    `${API_URL}/shoppingLists?userId=${userId}`,
  );

  if (!response.ok) {
    throw new Error("Failed to load shopping lists.");
  }

  return response.json();
}

export async function createShoppingList(
  shoppingList: object,
) {
  const response = await fetch(`${API_URL}/shoppingLists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(shoppingList),
  });

  if (!response.ok) {
    throw new Error("Failed to create shopping list.");
  }

  return response.json();
}

export async function updateShoppingList(
  id: string,
  shoppingList: object,
) {
  const response = await fetch(
    `${API_URL}/shoppingLists/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shoppingList),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update shopping list.");
  }

  return response.json();
}

export async function deleteShoppingList(id: string) {
  const response = await fetch(
    `${API_URL}/shoppingLists/${id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete shopping list.");
  }
}