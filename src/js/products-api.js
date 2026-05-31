import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, ITEMS_PER_PAGE } from './constants.js';

axios.defaults.baseURL = API_BASE_URL;

export async function getProducts(page = 1) {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const { data } = await axios(
    `${API_ENDPOINTS.PRODUCTS}?limit=${ITEMS_PER_PAGE}&skip=${skip}`
  );
  return data;
}

export async function getProductById(id) {
  const { data } = await axios(`${API_ENDPOINTS.PRODUCT_BY_ID}${id}`);
  return data;
}

export async function getCategories() {
  const { data } = await axios(`${API_ENDPOINTS.CATEGORIES}`);
  return data;
}

export async function getProductsByCategory(category) {
  const { data } = await axios(
    `${API_ENDPOINTS.PRODUCTS_BY_CATEGORY}${category}`
  );
  return data;
}

export async function searchProducts(query) {
  const { data } = await axios(`${API_ENDPOINTS.SEARCH}?q=${query}`);
  return data;
}

export async function getProductsByIds(ids) {
  return Promise.all(ids.map(id => getProductById(id)));
}
