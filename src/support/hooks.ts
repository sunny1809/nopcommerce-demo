import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { ChromiumBrowser } from '@playwright/test';
import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import { CustomWorld } from './custom-world';
import { HomePage } from '../pages/home.page';

chromium.use(stealthPlugin());
setDefaultTimeout(60000);

let browser: ChromiumBrowser;

BeforeAll(async function () {
  browser = (await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--disable-blink-features=AutomationControlled']
  })) as unknown as ChromiumBrowser;
});

AfterAll(async function () {
  await browser.close();
});

Before(async function (this: CustomWorld) {
  this.context = await browser.newContext({
    baseURL: 'https://demo.nopcommerce.com',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  });
  this.page = await this.context.newPage();
  this.homePage = new HomePage(this.page);
});

After(async function (this: CustomWorld, { result }) {
  if (result?.status === Status.FAILED && this.page) {
    const image = await this.page.screenshot();
    this.attach(image, 'image/png');
  }
  await this.page?.close();
  await this.context?.close();
});
