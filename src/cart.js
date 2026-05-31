//Логіка сторінки Cart
import {
  handleAddToCartClick,
  handleAddToWishlistClick,
  handleBuyProductsClick,
  handleProductClick,
  handleThemeToggleBtnClick,
  initCartPage,
} from './js/handlers.js';
import { loadCartProducts } from './js/helpers.js';
import { closeModal } from './js/modal.js';
import { refs } from './js/refs.js';

document.addEventListener('DOMContentLoaded', initCartPage);
refs.productsList.addEventListener('click', handleProductClick);
refs.modalCloseBtn.addEventListener('click', closeModal);
refs.addToWishlistBtn.addEventListener('click', handleAddToWishlistClick);
refs.buyProductsBtn.addEventListener('click', handleBuyProductsClick);
refs.themeToggleBtn.addEventListener('click', handleThemeToggleBtnClick);
refs.addToCartBtn.addEventListener('click', async event => {
  handleAddToCartClick(event);
  await loadCartProducts();
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
