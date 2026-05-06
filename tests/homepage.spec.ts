import { test, expect } from '../fixtures/page-fixtures';

test.describe('nopCommerce Homepage - Featured Products', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test('should display ADD TO CART buttons for each featured product', async ({ homePage }) => {
    const count = await homePage.getAddToCartButtonCount();

    console.log(`\n========================================`);
    console.log(`  Total "ADD TO CART" buttons found: ${count}`);
    console.log(`========================================\n`);

    expect(count).toBeGreaterThan(0);
  });

  test('should list all featured product names', async ({ homePage }) => {
    const products = await homePage.getFeaturedProductNames();

    console.log(`\n── Featured Products ──`);
    products.forEach((name, i) => console.log(`  ${i + 1}. ${name}`));
    console.log('');

    expect(products.length).toBeGreaterThan(0);
    products.forEach((name) => expect(name).not.toBe(''));
  });

  test('should have matching product count between items and ADD TO CART buttons', async ({
    homePage,
  }) => {
    const productCount = await homePage.getElementCount(homePage.productItems);
    const buttonCount = await homePage.getAddToCartButtonCount();

    console.log(`  Products: ${productCount} | ADD TO CART buttons: ${buttonCount}`);

    expect(buttonCount).toBe(productCount);
  });

  test('should display product details with name, price, and cart button', async ({
    homePage,
  }) => {
    const products = await homePage.getFeaturedProductDetails();

    console.log(`\n── Product Details ──`);
    products.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} — ${p.price} (Cart: ${p.hasAddToCart ? '✓' : '✗'})`);
    });
    console.log('');

    expect(products.length).toBeGreaterThan(0);
    products.forEach((p) => {
      expect(p.name).not.toBe('');
      expect(p.price).not.toBe('');
      expect(p.hasAddToCart).toBe(true);
    });
  });
});
