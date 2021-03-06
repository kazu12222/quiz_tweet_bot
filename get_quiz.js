const puppeteer = require("puppeteer");
require("date-utils");
require("dotenv").config();
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const waitTime = 3000;

const LOGIN_URL = `${process.env.QUIZ_SITE_URL}login/`;
const QUIZHUB_LOGIN_USER_MAIL = process.env.QUIZHUB_LOGIN_USER_MAIL;
const QUIZHUB_LOGIN_PASSWORD = process.env.QUIZHUB_LOGIN_PASSWORD;

async function getQuizElement(quizSiteUrl) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const dt = new Date();
  const dtParse = Date.parse(dt);
  page.setDefaultTimeout(100000);
  await page.goto(quizSiteUrl, {
    waitUntil: ["load", "networkidle2"],
  });
  await page.setCacheEnabled(false);
  await page.reload({ waitUntil: "networkidle2" });
  const list = await page.$$(".content-link");
  const title = await page.$$(".card-title");
  const user = await page.$$(".quiz-content__user");
  const createTime = await page.$$(".quiz-content__create");
  const answerPublishDates = [];
  const quizzes = [];
  for (let i = 0; i < 5; i++) {
    const object = {
      href: await (await list[i].getProperty("href")).jsonValue(),
      textContent: await (await list[i].getProperty("textContent")).jsonValue(),
      html: await (await list[i].getProperty("innerHTML")).jsonValue(),
      title: await (await title[i].getProperty("textContent")).jsonValue(),
      user: await (await user[i].getProperty("textContent")).jsonValue(),
      createTime: await (
        await createTime[i].getProperty("textContent")
      ).jsonValue(),
    };
    const createTimeString = object.createTime.toString();
    const createTimeParse = Date.parse(createTimeString);
    if (dtParse - 3600000 < createTimeParse && createTimeParse <= dtParse) {
      const stringAnswerPublishDate = object.textContent.toString();
      const str = stringAnswerPublishDate.match(/解答公開日：.+/);
      answerPublishDates.push(str ? str[0] : null);
      quizzes.push(object);
    }
  }
  await page.goto(LOGIN_URL, { waitUntil: ["load", "networkidle2"] });
  await page.setCacheEnabled(false);
  await page.reload({ waitUntil: "networkidle2" });

  await page.click("button[data-provider-id=password]");
  await sleep(waitTime);
  await page.type("input[type=email]", QUIZHUB_LOGIN_USER_MAIL);
  await sleep(waitTime);
  await page.click("button[type=submit]");
  await sleep(waitTime);
  await page.type("input[type=password]", QUIZHUB_LOGIN_PASSWORD);
  await page.click("button[type=submit]");
  await sleep(waitTime);
  for (let i = 0; i < quizzes.length; i++) {
    await page.goto(quizzes[i].href, {
      waitUntil: ["load", "networkidle2"],
    });
    await sleep(waitTime);
    const actionElements = await page.$$(".action");
    await actionElements[0].click();

    await sleep(waitTime);
  }

  await browser.close();
  return [quizzes, answerPublishDates];
}

module.exports.getQuizElement = getQuizElement;
