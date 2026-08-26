const UNSPLASH_ACCESS_KEY =import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

interface UnsplashPhoto {
  id: string;

  urls: {
    regular: string;
    small: string;
  };

  user: {
    name: string;

    links: {
      html: string;
    };
  };
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
}

export interface UnsplashImage {
  imageUrl: string;
  unsplashPhotoId: string;
  photographerName: string;
  photographerProfileUrl: string;
}

export async function searchUnsplashImage(
  searchTerm: string,
): Promise<UnsplashImage | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.error(
      "Unsplash Access Key is missing.",
    );

    return null;
  }

  if (!searchTerm.trim()) {
    return null;
  }

  const query = encodeURIComponent(
    searchTerm.trim(),
  );

  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=squarish`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      "Unable to search Unsplash.",
    );
  }

  const data: UnsplashSearchResponse =
    await response.json();

  if (data.results.length === 0) {
    return null;
  }

  const photo = data.results[0];

  return {
    imageUrl: photo.urls.small,
    unsplashPhotoId: photo.id,
    photographerName: photo.user.name,
    photographerProfileUrl:
      photo.user.links.html,
  };
}