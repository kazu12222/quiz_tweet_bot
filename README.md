# twitter bot

> My twitter bot Node.js project

## preparation

# .env セットアップ

https://zenn.dev/aphananthe42/articles/fcdd00729fee18
上記のリンクを参考にして
1,twitter Deceloper に登録
2,API KEY,Access Token を取得
3,必要なモジュールを取得
$ npm i date-utils
$ npm i dotenv
$ npm i puppeteer
$ npm i twitter-api-v2
4,.env を作成

# Type in each item

$ vim .env

> CONSUMER_KEY=
> CONSUMER_SECRET=
> ACCESS_TOKEN_KEY=
> ACCESS_TOKEN_SECRET=

## Build Setup

$crontab -e

>     * */1 * * * cd {your Directory}/tempcode;{which nodeを用いてパスを取得}/node {your Directory}/tempcode/bot.js >> {your Directory}/tempcode/a.txt
