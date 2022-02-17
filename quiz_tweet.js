let siteInfomation = require("./get_quiz_information.js");
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
  const quizSiteUrl = process.env.QUIZ_SITE_URL;
  const [quizzes, answerPublishDate] = await siteInfomation.getQuizElement(
    quizSiteUrl
  );
  for (let i = 0; i < quizzes.length; i++) {
    let href = quizzes[i].href;
    let title = quizzes[i].title;
    let user = quizzes[i].user;
    let createTime = quizzes[i].createTime;
    let structTime = quizzes[i].createTime.toString();
    structTime = structTime.slice(0, 10);
    createTime = isNaN(structTime) ? structTime.replace(/[^0-9/]|/g, "") : null;
    if (answerPublishDate[i] !== null) {
      let ansOpenDate = answerPublishDate[i];
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
    async function sleep() {
      await new Promise((s) => setTimeout(s, 3000));
    }
    sleep();
    console.log("3秒経過しました！");
  }
})();
