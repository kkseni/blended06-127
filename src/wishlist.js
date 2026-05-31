//Логіка сторінки Wishlist
import {
  handleAddToCartClick,
  handleAddToWishlistClick,
  handleProductClick,
  handleThemeToggleBtnClick,
  initWishlistPage,
} from './js/handlers.js';
import { loadWishlistProducts } from './js/helpers.js';
import { closeModal } from './js/modal.js';
import { refs } from './js/refs.js';

document.addEventListener('DOMContentLoaded', initWishlistPage);
refs.productsList.addEventListener('click', handleProductClick);
refs.modalCloseBtn.addEventListener('click', closeModal);
refs.addToCartBtn.addEventListener('click', handleAddToCartClick);
refs.themeToggleBtn.addEventListener('click', handleThemeToggleBtnClick);
refs.addToWishlistBtn.addEventListener('click', async event => {
  handleAddToWishlistClick(event);
  await loadWishlistProducts();
});
refs.scrollToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    refs.scrollToTopButton.classList.add('scroll-top-btn--visible');
  } else {
    refs.scrollToTopButton.classList.remove('scroll-top-btn--visible');
  }
});
