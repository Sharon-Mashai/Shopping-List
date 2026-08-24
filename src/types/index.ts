export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  notes?: string;
  category: string;
  createdAt: string;
}

export interface ShoppingItem {
  id: string;
  listId: string;
  name: string;
  quantity: number;
  category: string;
  image?: string;
  completed: boolean;
  createdAt: string;
}