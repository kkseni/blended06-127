//Логіка сторінки Home
import {
  handleAddToCartClick,
  handleAddToWishlistClick,
  handleCategoryClick,
  handleLoadMoreBtnClick,
  handleProductClick,
  handleSearchClear,
  handleSearchSubmit,
  handleThemeToggleBtnClick,
  initHomePage,
} from './js/handlers.js';
import { closeModal } from './js/modal.js';
import { refs } from './js/refs.js';

document.addEventListener('DOMContentLoaded', initHomePage);
refs.productsList.addEventListener('click', handleProductClick);
refs.categoriesList.addEventListener('click', handleCategoryClick);
refs.modalCloseBtn.addEventListener('click', closeModal);
refs.addToCartBtn.addEventListener('click', handleAddToCartClick);
refs.addToWishlistBtn.addEventListener('click', handleAddToWishlistClick);
refs.searchForm.addEventListener('submit', handleSearchSubmit);
refs.searchClearBtn.addEventListener('click', handleSearchClear);
refs.loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);
refs.themeToggleBtn.addEventListener('click', handleThemeToggleBtnClick);
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
