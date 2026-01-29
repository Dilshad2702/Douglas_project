import { test, expect } from '@playwright/test';
import { testData } from './testData.js';

class DouglasPage {
  constructor(page) {
    this.page = page;
  }

  async handleCookieConsent() {
    try {
      await this.page.waitForSelector('[data-testid="uc-accept-all-button"]', { timeout: 5000 });
      await this.page.click('[data-testid="uc-accept-all-button"]');
    } catch {
      // Cookie banner might not appear or have different selector
      console.log('Cookie consent not found or already handled');
    }
  }

  async navigateToParfum() {
    await this.page.hover('nav a[href*="parfum"]');
    await this.page.click('nav a[href*="parfum"]');
    await this.page.waitForLoadState('networkidle');
  }

  async applyFilters(filters) {
    if (filters.highlights) {
      for (const highlight of filters.highlights) {
        await this.page.click(`text="${highlight}"`);
        await this.page.waitForTimeout(1000);
      }
    }

    if (filters.marke) {
      await this.page.click('text="Marke"');
      for (const brand of filters.marke) {
        await this.page.click(`text="${brand}"`);
        await this.page.waitForTimeout(1000);
      }
    }

    if (filters.produktart) {
      await this.page.click('text="Produktart"');
      for (const type of filters.produktart) {
        await this.page.click(`text="${type}"`);
        await this.page.waitForTimeout(1000);
      }
    }
  }

  async getProductList() {
    await this.page.waitForSelector('[data-testid="product-tile"]', { timeout: 10000 });
    const products = await this.page.$$eval('[data-testid="product-tile"]', elements => 
      elements.slice(0, 5).map(el => ({
        name: el.querySelector('[data-testid="product-name"]')?.textContent?.trim() || 'N/A',
        price: el.querySelector('[data-testid="product-price"]')?.textContent?.trim() || 'N/A',
        brand: el.querySelector('[data-testid="product-brand"]')?.textContent?.trim() || 'N/A'
      }))
    );
    return products;
  }
}

test.describe('Douglas Parfum Tests', () => {
  testData.forEach(({ testName, filters }) => {
    test(`${testName}`, async ({ page }) => {
      const douglasPage = new DouglasPage(page);
      
      await page.goto('/de');
      await douglasPage.handleCookieConsent();
      await douglasPage.navigateToParfum();
      await douglasPage.applyFilters(filters);
      
      const products = await douglasPage.getProductList();
      
      expect(products.length).toBeGreaterThan(0);
      console.log(`${testName} - Found ${products.length} products:`);
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - ${product.brand} - ${product.price}`);
      });
    });
  });
});