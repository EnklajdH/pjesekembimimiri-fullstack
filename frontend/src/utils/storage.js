import { seedCategories, seedProducts } from '../data/seed';

const PRODUCTS_KEY = 'pkm_products';
const CATEGORIES_KEY = 'pkm_categories';

export function initializeStorage() {
  if (!localStorage.getItem(PRODUCTS_KEY)) localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seedProducts));
  if (!localStorage.getItem(CATEGORIES_KEY)) localStorage.setItem(CATEGORIES_KEY, JSON.stringify(seedCategories));
}

export function getProducts() {
  initializeStorage();
  return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
}
export function saveProducts(products) { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)); }
export function getCategories() {
  initializeStorage();
  return JSON.parse(localStorage.getItem(CATEGORIES_KEY)) || [];
}
export function saveCategories(categories) { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories)); }
export function categoryName(categories, id) {
  return categories.find(c => Number(c.id) === Number(id))?.name || 'Pa kategori';
}
export function categoryPath(categories, id) {
  const current = categories.find(c => Number(c.id) === Number(id));
  if (!current) return 'Pa kategori';
  if (!current.parentId) return current.name;
  const parent = categories.find(c => Number(c.id) === Number(current.parentId));
  return parent ? `${parent.name} > ${current.name}` : current.name;
}
export function nextId(items) { return items.length ? Math.max(...items.map(i => Number(i.id))) + 1 : 1; }
