# quiz-tweet bot

> My brilliant Node.js project

## Advance preparation

https://zenn.dev/aphananthe42/articles/fcdd00729fee18
上の記事を参考に
1,Twitter Developer に登録
2,API Key, Access Token を取得
3,必要な node モジュールをインストール
$ npm i date-utils
$ npm i dotenv
$ npm i puppeteer
$ twitter-api-v2
4,.env 作成
CONSUMER_KEY=
CONSUMER_SECRET=
ACCESS_TOKEN_KEY=
ACCESS_TOKEN_SECRET=

## Build Setup

1,crontab 作成
$ crontab -e

> - _/1 _ \* \* cd [ディレクトリ名]; [which node で調べたフルパス] [quiz_tweet_bot.js のフルパス]
