export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  category: string;
  notes?: string;
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