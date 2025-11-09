// npm install cheerio selenium-webdriver axios
// npm install @types/selenium-webdriver

export { reqGet, reqPost, reqPatch, reqDelete, reqUpsert, reqGql } from './request.js';
export { PlaywrightChromeProfile, getPlaywrightChromeProfileByEmail } from './playwright-chrome-profile.js';
export { PlaywrightChromeBasic, gotoByPlaywrightBasic } from './playwright-chrome-basic.js';
