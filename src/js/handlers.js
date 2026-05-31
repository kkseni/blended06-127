import {
  checkVisibilityLoadMoreButton,
  isValidSearchQuery,
  loadCartProducts,
  loadWishlistProducts,
  showToast,
  toggleActiveClass,
  toggleTheme,
} from './helpers.js';
import { openModal } from './modal.js';
import {
  getCategories,
  getProductById,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from './products-api.js';
import { refs } from './refs.js';
import {
  clearProductsList,
  hideLoadMoreButton,
  hideNotFound,
  renderCategories,
  renderProductInModal,
  renderProducts,
  showLoadMoreButton,
  showLoadMoreButtonLoading,
  showNotFound,
  updateCartSummary,
  updateCounters,
} from './render-function.js';
import {
  addToCart,
  addToWishlist,
  getCartItems,
  getTheme,
  getWishlistItems,
  isInCart,
  isInWishlist,
  removeFromCart,
  removeFromWishlist,
  saveTheme,
} from './storage.js';

let currentProductId = null;
let currentPage = 1;

export async function initHomePage() {
  const savedTheme = getTheme();
  toggleTheme(savedTheme);
  const cartItems = getCartItems();
  const wishListItems = getWishlistItems();
  updateCounters(cartItems, wishListItems);

  try {
    const categories = await getCategories();
    renderCategories(categories);

    const { products, total } = await getProducts(currentPage);
    if (products.length === 0) {
      showToast('No products found', 'info');
      showNotFound();
      return;
    }
    renderProducts(products);
    checkVisibilityLoadMoreButton(total, currentPage);
    showLoadMoreButton();
  } catch (error) {
    console.error('Error initializing home page:', error);
    showToast('Failed to initialize page', 'error');
  }
}

export async function initCartPage() {
  const savedTheme = getTheme();
  toggleTheme(savedTheme);

  updateCounters(getCartItems(), getWishlistItems());

  await loadCartProducts();
}

export async function initWishlistPage() {
  const savedTheme = getTheme();
  toggleTheme(savedTheme);

  updateCounters(getCartItems(), getWishlistItems());

  await loadWishlistProducts();
}

export async function handleLoadMoreBtnClick() {
  currentPage += 1;
  showLoadMoreButtonLoading();
  try {
    const { products, total } = await getProducts(currentPage);
    renderProducts(products);
    checkVisibilityLoadMoreButton(total, currentPage);
  } catch (error) {
    console.error('Error loadMore click:', error);
    showToast('Failed to loadMore click', 'error');
  }
}

export async function handleProductClick(event) {
  const productItem = event.target.closest('.products__item');
  if (!productItem) return;

  try {
    const productId = Number(productItem.dataset.id);
    currentProductId = productId;

    const product = await getProductById(productId);
    renderProductInModal(product);
    openModal();
  } catch (error) {
    console.error('Error fetching product details:', error);
    showToast('Failed to load product details', 'error');
  }
}

export function handleAddToCartClick() {
  if (!currentProductId) return;

  try {
    if (isInCart(currentProductId)) {
      removeFromCart(currentProductId);
      refs.addToCartBtn.textContent = 'Add to Cart';
      showToast('Product removed from cart', 'info');
    } else {
      addToCart(currentProductId);
      refs.addToCartBtn.textContent = 'Remove from Cart';
      showToast('Product added to cart', 'success');
    }
    updateCounters(getCartItems(), getWishlistItems());
  } catch (error) {
    console.error('Error updating cart:', error);
    showToast('Failed to update cart', 'error');
  }
}

export function handleAddToWishlistClick() {
  if (!currentProductId) return;

  try {
    if (isInWishlist(currentProductId)) {
      removeFromWishlist(currentProductId);
      refs.addToWishlistBtn.textContent = 'Add to Wishlist';
      showToast('Product removed from wishlist', 'info');
    } else {
      addToWishlist(currentProductId);
      refs.addToWishlistBtn.textContent = 'Remove from Wishlist';
      showToast('Product added to wishlist', 'success');
    }

    updateCounters(getCartItems(), getWishlistItems());
  } catch (error) {
    console.error('Error updating wishlist:', error);
    showToast('Failed to update wishlist', 'error');
  }
}

export async function handleCategoryClick(event) {
  const categoryBtn = event.target.closest('.categories__btn');
  if (!categoryBtn) return;
  hideLoadMoreButton();
  clearProductsList();
  try {
    const category = categoryBtn.dataset.category;
    const allCategoryBtns = document.querySelectorAll('.categories__btn');

    toggleActiveClass(allCategoryBtns, categoryBtn, 'categories__btn--active');

    let productsData;

    if (category === 'All') {
      productsData = await getProducts();
      showLoadMoreButton();
    } else {
      productsData = await getProductsByCategory(category);
    }

    if (productsData.products.length > 0) {
      renderProducts(productsData.products);
      hideNotFound();
    } else {
      showNotFound();
    }
  } catch (error) {
    console.error('Error fetching products by category:', error);
    showToast('Failed to load products', 'error');
    showNotFound();
  }
}

export async function handleSearchSubmit(event) {
  event.preventDefault();

  const query = refs.searchInput.value;

  if (!isValidSearchQuery(query)) {
    showToast('Please enter a valid search query', 'warning');
    return;
  }
  clearProductsList();
  hideLoadMoreButton();
  try {
    const { products } = await searchProducts(query);

    if (products.length > 0) {
      renderProducts(products);
      hideNotFound();
    } else {
      showNotFound();
    }
  } catch (error) {
    console.error('Error searching products:', error);
    showToast('Failed to search products', 'error');
    showNotFound();
    hideLoadMoreButton();
  }
}

export async function handleSearchClear() {
  refs.searchInput.value = '';
  currentPage = 1;
  clearProductsList();
  try {
    const { products, total } = await getProducts(currentPage);

    if (products.length > 0) {
      renderProducts(products);
      hideNotFound();
      showLoadMoreButton();
      checkVisibilityLoadMoreButton(total, currentPage);
    } else {
      showNotFound();
      hideLoadMoreButton();
      console.log('ELSE');
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    showToast('Failed to load products', 'error');
    showNotFound();
    hideLoadMoreButton();
  }
}

export function handleBuyProductsClick() {
  const cartItems = getCartItems();

  if (cartItems.length === 0) {
    showToast('Your cart is empty', 'warning');
    return;
  }

  showToast('Thank you for your purchase!', 'success');
  localStorage.removeItem('cart');

  updateCounters([], getWishlistItems());
  updateCartSummary([]);
  window.location.reload();
}

export function handleThemeToggleBtnClick() {
  const currentTheme = document.body.getAttribute('data-theme') || 'light';
  console.log(currentTheme);
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  toggleTheme(newTheme);
  saveTheme(newTheme);

  refs.themeToggleBtn.innerHTML = newTheme === 'light' ? '🌙' : '☀️';
}
