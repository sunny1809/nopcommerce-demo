import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage - Page Object for the nopCommerce demo homepage.
 *
 * Encapsulates all locators and actions specific to the homepage,
 * including the featured products section and header/footer navigation.
 */
export class HomePage extends BasePage {
  // ── Locators (lazy, evaluated on access) ────────────────────

  // Header
  readonly logo: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly cartLink: Locator;
  readonly wishlistLink: Locator;

  // Category navigation
  readonly topMenuCategories: Locator;

  // Featured products section
  readonly featuredProductsHeading: Locator;
  readonly productItems: Locator;
  readonly productTitles: Locator;
  readonly productPrices: Locator;
  readonly addToCartButtons: Locator;

  // Footer
  readonly footerLinks: Locator;

  constructor(page: Page) {
    super(page);

    // Header
    this.logo = page.locator('.header-logo a');
    this.searchInput = page.locator('#small-searchterms');
    this.searchButton = page.locator('.search-box-button');
    this.cartLink = page.locator('#topcartlink');
    this.wishlistLink = page.locator('.ico-wishlist');

    // Category navigation
    this.topMenuCategories = page.locator('.top-menu.notmobile > li > a');

    // Featured products
    this.featuredProductsHeading = page.locator('.home-page-product-grid .title strong');
    this.productItems = page.locator('.product-item');
    this.productTitles = page.locator('.product-item .product-title a');
    this.productPrices = page.locator('.product-item .actual-price');
    this.addToCartButtons = page.locator('button.product-box-add-to-cart-button');

    // Footer
    this.footerLinks = page.locator('.footer-block a');
  }

  // ── Page actions ────────────────────────────────────────────

  /** Open the homepage */
  async open() {
    await this.navigate('/');
  }

  /** Search for a product using the header search bar */
  async searchProduct(keyword: string) {
    await this.fillInput(this.searchInput, keyword);
    await this.clickElement(this.searchButton, true);
  }

  /** Navigate to the shopping cart */
  async goToCart() {
    await this.clickElement(this.cartLink, true);
  }

  /** Navigate to the wishlist */
  async goToWishlist() {
    await this.clickElement(this.wishlistLink, true);
  }

  /** Click a top-menu category by its visible text */
  async clickCategory(categoryName: string) {
    const category = this.topMenuCategories.filter({ hasText: categoryName });
    await this.clickElement(category, true);
  }

  // ── Featured products helpers ───────────────────────────────

  /** Return the number of "ADD TO CART" buttons on the page */
  async getAddToCartButtonCount(): Promise<number> {
    return this.getElementCount(this.addToCartButtons);
  }

  /** Return an array of all featured product names */
  async getFeaturedProductNames(): Promise<string[]> {
    const names = await this.getAllTexts(this.productTitles);
    return names.map((n) => n.trim());
  }

  /** Return an array of all featured product prices as strings */
  async getFeaturedProductPrices(): Promise<string[]> {
    const prices = await this.getAllTexts(this.productPrices);
    return prices.map((p) => p.trim());
  }

  /**
   * Return a structured list of featured products with their
   * name, price, and whether an "Add to Cart" button exists.
   */
  async getFeaturedProductDetails(): Promise<
    { name: string; price: string; hasAddToCart: boolean }[]
  > {
    const count = await this.getElementCount(this.productItems);
    const products: { name: string; price: string; hasAddToCart: boolean }[] = [];

    for (let i = 0; i < count; i++) {
      const card = this.productItems.nth(i);
      const name = (await card.locator('.product-title a').textContent()) ?? '';
      const price = (await card.locator('.actual-price').textContent()) ?? '';
      const addToCartBtn = card.locator('button.product-box-add-to-cart-button');
      const hasAddToCart = (await addToCartBtn.count()) > 0;

      products.push({
        name: name.trim(),
        price: price.trim(),
        hasAddToCart,
      });
    }

    return products;
  }

  /** Click the "ADD TO CART" button for a product by its name */
  async addProductToCart(productName: string) {
    const productCard = this.productItems.filter({
      has: this.page.locator('.product-title a', { hasText: productName }),
    });
    const addBtn = productCard.locator('button.product-box-add-to-cart-button');
    await this.clickElement(addBtn, true);
  }
}
