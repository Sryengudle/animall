const KEY = 'animall_wishlist';

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
};

const write = (list) => {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('wishlist:change', { detail: list }));
};

export const getWishlist = () => read();

export const isWishlisted = (id) => read().includes(id);

export const toggleWishlist = (id) => {
  const list = read();
  const idx = list.indexOf(id);
  if (idx >= 0) list.splice(idx, 1);
  else list.push(id);
  write(list);
  return idx < 0; // returns true if newly added
};

export const subscribeWishlist = (callback) => {
  const handler = (e) => callback(e.detail);
  window.addEventListener('wishlist:change', handler);
  return () => window.removeEventListener('wishlist:change', handler);
};
