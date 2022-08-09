import * as puppeteer from "puppeteer";
import {Browser, launch, Page} from "puppeteer";
import {Job} from "../configuration/abstractions/job";
import {DEFAULT_BROWSER_OPTIONS, DEFAULT_USER_AGENT, DEFAULT_WAIT_EVENT_NAME} from "./browser-constants";
import {from, map, mergeMap, of, shareReplay} from "rxjs";
import {ShredderConfig} from "../configuration/abstractions/shredder-config";

function navigateToPage(options: Job) {
  return (page: Page) => from(page.goto(options.uri, {
    waitUntil: DEFAULT_WAIT_EVENT_NAME
  })).pipe(map(_ => page));
}

function trySetUserAgent(browserContext: { browser: Browser; isShared: boolean }) {
  return (page: Page) => !browserContext.isShared
    ? from(page.setUserAgent(DEFAULT_USER_AGENT)).pipe(
      map(() => page)
    )
    : of(page);
}

export function getJobResource(
  browserContext: { browser: Browser, isShared: boolean },
  options: Job
) {
  return from(browserContext.browser.newPage()).pipe(
    mergeMap(trySetUserAgent(browserContext)),
    mergeMap(navigateToPage(options)),
    map(page => [page, browserContext.browser] as [Page, Browser])
  )
}

export function getJobContext(options: Job, sharedBrowser?: Browser) {
  return (sharedBrowser
      ? of(sharedBrowser)
      : from(launch(DEFAULT_BROWSER_OPTIONS))
  ).pipe(
    mergeMap(browser => getJobResource({
      browser,
      isShared: !sharedBrowser
    }, options))
  );
}

export function getBrowserInstanceFromConfiguration(config: ShredderConfig) {
  return from(puppeteer.launch(
    config.headless === false ?
      {...DEFAULT_BROWSER_OPTIONS, headless: false} :
      DEFAULT_BROWSER_OPTIONS
  )).pipe(
    shareReplay(1)
  );
}
