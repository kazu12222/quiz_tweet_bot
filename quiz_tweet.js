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
    const href = quizzes[i].href;
    const title = quizzes[i].title;
    const user = quizzes[i].user;
    let createTime = quizzes[i].createTime;
    const stringTime = quizzes[i].createTime.toString();
    const getStringTime = stringTime.slice(0, 10);
    createTime = isNaN(getStringTime)
      ? getStringTime.replace(/[^0-9/]|/g, "")
      : null;
    if (answerPublishDate[i] !== null) {
      let ansOpenDate = answerPublishDate[i];
      const stringAnsDay = ansOpenDate.toString();
      ansOpenDate = isNaN(stringAnsDay)
        ? stringAnsDay.replace(/[^0-9/]|/g, "")
        : null;
    }
    const selectTweet =
      answerPublishDate[i] !== null ? "日は${ansOpenDate}" : "は公開済み";
    const tweetContents = `${user}さんから新規Quizご登録いただきました！\n一般解答公開${selectTweet}です。\n\n${title} ${createTime})\n #AAAAAA\n${href}`;
    await twitterClient.v2.tweet(tweetContents);

    async function sleep() {
      await new Promise((s) => setTimeout(s, 3000));
    }
    sleep();
  }
})();
