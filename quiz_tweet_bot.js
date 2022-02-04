var time = require("./bots_puppeteer.js");
require("dotenv").config();
const { TwitterApi } = require("twitter-api-v2");
const { WaitTask } = require("puppeteer");

// Instanciate with desired auth type (here's Bearer v2 auth)
const twitterClient = new TwitterApi({
  appKey: process.env.CONSUMER_KEY,
  appSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.ACCESS_TOKEN_KEY,
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
});
// Play with the built in methods
(async () => {
  const rwClient = twitterClient.readWrite;
  const appOnlyClientFromConsumer = await twitterClient.appLogin();
  const [botsData, cnt, ansOpenDateValue] = await time.getQuizElement();
  for (let i = 0; i < cnt; i++) {
    let href = botsData[i].href;
    let title = botsData[i].title;
    let user = botsData[i].user;
    let createTime = botsData[i].createTime;
    let structTime = botsData[i].createTime.toString();
    structTime = structTime.slice(0, 10);
    createTime = isNaN(structTime) ? structTime.replace(/[^0-9/]|/g, "") : null;
    if (ansOpenDateValue[i] !== null) {
      let ansOpenDate = ansOpenDateValue[i];
      let structAnsDay = ansOpenDate.toString();
      ansOpenDate = isNaN(structAnsDay)
        ? structAnsDay.replace(/[^0-9/]|/g, "")
        : null;
      await twitterClient.v2.tweet(
        user +
          "さんから新規Quizご登録いただきました！\n一般解答公開日は" +
          ansOpenDate +
          "です。\n\n" +
          title +
          "(" +
          createTime +
          ")\n" +
          "#AAAAAA\n" +
          href
      );
    } else {
      await twitterClient.v2.tweet(
        user +
          "さんから新規Quizご登録いただきました！\n一般解答公開は公開済みです。\n\n" +
          title +
          "(" +
          createTime +
          ")\n" +
          "#AAAAAA\n" +
          href
      );
    }
    function sleep(waitMsec) {
      let startMsec = new Date();
      while (new Date() - startMsec < waitMsec);
    }
    sleep(5000);
    console.log("5秒経過しました！");
  }
})();
