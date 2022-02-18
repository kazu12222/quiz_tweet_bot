# quiz-tweet bot

> My brilliant Node.js project

## Advance preparation

この記事を参考に https://zenn.dev/aphananthe42/articles/fcdd00729fee18

1,Twitter Developer に登録

2,API Key, Access Token を取得

3,必要な node モジュールをインストール

$ npm init
[](出てくる項目は全てEnter)

$ npm i date-utils

$ npm i dotenv

$ npm i puppeteer

$ npm i twitter-api-v2

4,.env 作成

CONSUMER_KEY=

CONSUMER_SECRET=

ACCESS_TOKEN_KEY=

ACCESS_TOKEN_SECRET=

QUIZ_SITE_URL=

LOGIN_URL=

QUIZHUB_LOGIN_USER_MAIL=

QUIZHUB_LOGIN_PASSWORD=

## Build Setup

1,crontab 作成

$ crontab -e

    * */1 * * * cd [ディレクトリ名]; [which node で調べたフルパス] [quiz_tweet_bot.js のフルパス]
