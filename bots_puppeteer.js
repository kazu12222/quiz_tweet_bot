const puppeteer = require("puppeteer");
require("date-utils");
require("dotenv").config();
function sleep(waitMsec) {
  let startMsec = new Date();
  while (new Date() - startMsec < waitMsec);
}

function getFilename() {
  // タイムゾーンを調整して文字列化します。
  const offset = new Date().getTimezoneOffset() * 60000;
  const iso = new Date(Date.now() - offset).toISOString();
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
  return `${m[1]}${m[2]}${m[3]}-${m[4]}${m[5]}${m[6]}.png`;
}

const LOGIN_URL = process.env.LOGIN_URL;
const LOGIN_USER_MAIL = process.env.LOGIN_USER_MAIL;
const LOGIN_PASS = process.env.LOGIN_PASS;
const LOGIN_MAIL_SELECTOR = process.env.LOGIN_MAIL_SELECTOR;
const LOGIN_PASS_SELECTOR = process.env.LOGIN_PASS_SELECTOR;
const LOGIN_SUBMIT_SELECTOR = process.env.LOGIN_SUBMIT_SELECTOR;
const CHOOSE_LOGINWAY_MAIL = process.env.CHOOSE_LOGINWAY_MAIL;

async function getQuizElement(quizSiteUrl) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const dt = new Date();
  const dtFormatted = dt.toFormat("YYYYMMDDHH24MI");
  const listSelector = ".content-link";
  const titleSelector = ".card-title";
  const userSelector = ".quiz-content__user";
  const createTimeSelector = ".quiz-content__create";

  page.setDefaultTimeout(100000);
  await page.goto(quizSiteUrl, {
    waitUntil: ["load", "networkidle2"],
  });
  await page.setCacheEnabled(false);
  await page.reload({ waitUntil: "networkidle2" });
  const list = await page.$$(listSelector);
  const title = await page.$$(titleSelector);
  const user = await page.$$(userSelector);
  const createTime = await page.$$(createTimeSelector);
  const ansDate = [];
  const quizData = [];
  for (let i = 0; i < 5; i++) {
    let data = {
      href: await (await list[i].getProperty("href")).jsonValue(),
      textContent: await (await list[i].getProperty("textContent")).jsonValue(),
      html: await (await list[i].getProperty("innerHTML")).jsonValue(),
      title: await (await title[i].getProperty("textContent")).jsonValue(),
      user: await (await user[i].getProperty("textContent")).jsonValue(),
      createTime: await (
        await createTime[i].getProperty("textContent")
      ).jsonValue(),
    };

    let structData = data.createTime.toString();
    const onlyCreateNum = isNaN(structData)
      ? structData.replace(/[^0-9]/g, "")
      : null;
    if (
      String(dtFormatted - 100) < String(onlyCreateNum) &&
      String(onlyCreateNum) <= String(dtFormatted)
    ) {
      let structtext = data.textContent.toString();
      let temp = structtext.match(/解答公開日：.+/);
      let ansDay;
      if (temp !== null) {
        ansDay = temp[0];
      } else {
        ansDay = null;
      }
      ansDate.push(ansDay);
      quizData.push(data);
    }
  }
  console.log(quizData.length);
  console.log("ここからログイン");
  await page.goto(LOGIN_URL, { waitUntil: ["load", "networkidle2"] });
  await page.setCacheEnabled(false);
  await page.reload({ waitUntil: "networkidle2" });

  await page.click(CHOOSE_LOGINWAY_MAIL);
  sleep(3000);
  await page.type(LOGIN_MAIL_SELECTOR, LOGIN_USER_MAIL); // メールアドレス入力
  sleep(3000);
  await page.click(LOGIN_SUBMIT_SELECTOR); //次へ
  sleep(3000);
  await page.type(LOGIN_PASS_SELECTOR, LOGIN_PASS); // パスワード入力
  await page.click(LOGIN_SUBMIT_SELECTOR);
  sleep(3000);
  for (let i = 0; i < quizData.length; i++) {
    console.log(quizData[i].href);
    await page.goto(quizData[i].href, {
      waitUntil: ["load", "networkidle2"],
    });
    sleep(3000);

    let actionTagAll = await page.$$(".action");
    let tagText = [];
    let indicator = "";
    console.log(actionTagAll.length);
    for (let i = 0; i < actionTagAll.length; i++) {
      tagText.push(
        await (await actionTagAll[i].getProperty("textContent")).jsonValue()
      );
      if (tagText[i].match(/いいね/)) {
        indicator = i;
        break;
      }
    }
    await actionTagAll[indicator].click();
    sleep(3000);
  }

  await browser.close();
  return [quizData, ansDate];
}

module.exports.getQuizElement = getQuizElement;
