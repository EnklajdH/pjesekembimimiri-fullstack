const API_BASE_URL = "http://127.0.0.1:8000";

const fallbackImage =
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=80";

export function getImageUrl(image) {
  if (!image) {
    return fallbackImage;
  }

  if (image.startsWith("http")) {
    return image;
  }

  if (image.startsWith("blob:")) {
    return image;
  }

  if (image.startsWith("/storage/")) {
    return `${API_BASE_URL}${image}`;
  }

  if (image.startsWith("storage/")) {
    return `${API_BASE_URL}/${image}`;
  }

  return `${API_BASE_URL}/storage/${image}`;
}