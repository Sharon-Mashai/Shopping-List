export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  category: string;
  notes?: string;
  createdAt: string;

  imageUrl?: string;
  unsplashPhotoId?: string;
  photographerName?: string;
  photographerProfileUrl?: string;
}

export interface ShoppingItem {
  id: string;
  listId: string;
  name: string;
  quantity: number;
  category: string;
  completed: boolean;
  createdAt: string;

  imageUrl?: string;
  unsplashPhotoId?: string;
  photographerName?: string;
  photographerProfileUrl?: string;
}