const puppeteer = require("puppeteer");
require("date-utils");
async function getQuizElement() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let dt = new Date();
  let dtFormatted = dt.toFormat("YYYYMMDDHH24MI");
  let listSelector = ".content-link";
  let titleSelector = ".card-title";
  let userSelector = ".quiz-content__user";
  let createTimeSelector = ".quiz-content__create";
  let cnt = 0;

  page.setDefaultTimeout(100000);
  await page.goto(process.env.URL, {
    waitUntil: ["load", "networkidle2"],
  });
  await page.setCacheEnabled(false);
  await page.reload({ waitUntil: "networkidle2" });
  let list = await page.$$(listSelector);
  let title = await page.$$(titleSelector);
  let user = await page.$$(userSelector);
  let createTime = await page.$$(createTimeSelector);
  let ansDate = [];
  let quizData = [];
  for (let i = 0; i < 5; i++) {
    let data = {
      href: await (await list[i].getProperty("href")).jsonValue(),
      textContent: await (await list[i].getProperty("textContent")).jsonValue(),
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
      cnt++;
    }
  }
  console.log(quizData);
  await browser.close();
  return [quizData, cnt, ansDate];
}
module.exports.getQuizElement = getQuizElement;
