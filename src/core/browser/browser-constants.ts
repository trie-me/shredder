import {PuppeteerLaunchOptions} from "puppeteer";

export const DEFAULT_SELECTOR_TIMEOUT = 5000;
export const DEFAULT_BROWSER_OPTIONS: PuppeteerLaunchOptions = {
  headless: true,
  product: 'chrome',
  defaultViewport: {
    width: 1080,
    height: 700
  },
  waitForInitialPage: false
};
export const DEFAULT_USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36";
export const DEFAULT_WAIT_EVENT_NAME = 'domcontentloaded';
