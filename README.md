# Simple Twitter - Sequelize

## Contents
- [簡介](#簡介)
- [環境建置與需求](#環境建置與需求)
- [軟體](#軟體)
- [clone 與安裝相依套件](#clone-與安裝相依套件)
- [設定檔](#設定檔)
- [修改資料庫 config 檔](#修改資料庫-config-檔)
- [資料庫設定與測試資料準備](#資料庫設定與測試資料準備)
- [執行方式](#執行方式)
- [系統網址](#系統網址)
- [功能](#功能)
- [Change Logs](#change-logs)
- [Contributor](#contributor)

## 簡介
* 使用角色
  * 一般使用者 (須登入)
  * 網站管理員
* 註冊/登入/登出
  * 除了註冊和登入頁，使用者一定要登入才能使用網站
  * 註冊時，使用者可以創建帳號，並設定名稱、信箱與密碼
  * 註冊時，使用者的名稱和 email 不能重覆，若有重覆會跳出錯誤
* 前台
  * 使用者能瀏覽所有的推播 (tweet)
  * 使用者能在首頁看見跟隨者 (followers) 數量排列前 10 的使用者推薦名單
  * 點擊其他使用者的名稱時，能瀏覽該使用者的個人資料及推播
  * 使用者能新增推播
    * 推播字數限制在 140 以內，且不能為空白
    * 若不符合規定，會跳回同一頁並顯示錯誤訊息
  * 使用者能回覆別人的推播
    * 回覆文字不能為空白
    * 若不符合規定，會跳回同一頁並顯示錯誤訊息
  * 使用者可以追蹤/取消追蹤其他使用者 (不能追蹤自己)
  * 使用者能對別人的推播按 Like/Unlike
  * 任何登入使用者都可以瀏覽特定使用者的以下資料：
    * Tweets：排序依日期，最新的在前
    * Following：該使用者的關注清單，排序依照追蹤紀錄成立的時間，愈新的在愈前面
    * Follower：該使用者的跟隨者清單，排序依照追蹤紀錄成立的時間，愈新的在愈前面
    * Like：該使用者 like 過的推播清單，排序依 like 紀錄成立的時間，愈新的在愈前面
* 使用者能編輯自己的名稱、介紹和大頭照
* 後台
  * 管理者登入網站後，能夠經由瀏覽列進入後台頁面 (只有管理員能看見後台入口)
  * 在後台介面
    * 管理者可以瀏覽全站的推播清單
      * 可以直接在清單上快覽推播回覆內容前 50 個字
      * 可以在清單上刪除使用者的推播
    * 管理者可以瀏覽站內所有的使用者清單，清單的資訊包括
      * 使用者社群活躍數據，包括推播數量、關注人數、跟隨者人數、推播被 like 的數量)
      * 清單預設按推播文數排序

## 環境建置與需求
* bcrypt-nodejs: 0.0.3
* body-parser: ^1.18.3
* chai: ^4.2.0
* connect-flash: ^0.1.1
* dotenv: ^8.1.0
* express: ^4.16.4
* express-handlebars: ^3.0.0
* express-session: ^1.15.6
* faker: ^4.1.0
* imgur-node-api: ^0.1.0
* method-override: ^3.0.0
* mocha: ^6.0.2
* moment: ^2.24.0
* multer: ^1.4.2
* mysql2: ^1.6.4
* passport: ^0.4.0
* passport-local: ^1.0.0
* sequelize: ^4.42.0
* sequelize-cli: ^5.5.0
* sinon: ^7.2.3
* sinon-chai: ^3.3.0

## 軟體
* Visual Studio Code
* Git
* MySQL
* [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)

## clone 與安裝相依套件
* 請在 `Console` 輸入下方指令
  * 從 GitHub Clone 專案
  ```
  https://github.com/ArcherHuang/simple-twitter-express-starter.git
  ```
  * 切換路徑到專案資料夾
  ```
  cd ./simple-twitter-express-starter-master/
  ``` 
  * 安裝相關套件
  ``` 
  npm install
  ``` 
  * 透過 Visual Studio Code 開啟專案
  ``` 
  code .
  ``` 
  
## 設定檔
* 請在專案的根目錄新增 `.env` 檔，以存放圖片到 `IMGUR`，其格式如下

```
// .env

IMGUR_CLIENT_ID=

```

## 修改資料庫 config 檔
* 路徑
  * ./config/config.json
* 修改內容
  * Local 端測試

  ```
  "test": {
    "username": "root",
    "password": "password",
    "database": "ac_twitter_workspace_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  }

  ```
  
  * Travis 端測試
  ```
  "test": {
    "username": "travis",
    "database": "ac_twitter_workspace_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
  ```

## 資料庫設定與測試資料準備
* 請在 MySQL Workbench 輸入下方指令
  * 確認是否已存在資料庫，如已存在則刪除
    * `ac_twitter_workspace_test` 資料庫
    ```
    drop database if exists ac_twitter_workspace_test;
    ```
    * `ac_twitter_workspace` 資料庫
    ```
    drop database if exists ac_twitter_workspace;
    ```
  * 建立資料庫
    * 建立 `ac_twitter_workspace_test` 資料庫
    ```
    create database ac_twitter_workspace_test;
    ```
    * 建立 `ac_twitter_workspace` 資料庫
    ```
    create database ac_twitter_workspace;
    ```
  * 使用資料庫
    * 使用 `ac_twitter_workspace_test` 資料庫
    ```
    use ac_twitter_workspace_test;
    ```
    * 使用 `ac_twitter_workspace` 資料庫
    ```
    use ac_twitter_workspace;
    ```

* 請在 `Console` 輸入下方指令
  * 建立開發環境的 Table 與種子
    * 建立 Table
    ```
    npx sequelize-cli db:migrate
    ```
    * 在建立測試資料
      * 新增
      ```
      npx sequelize-cli db:seed:all
      ```
      * 刪除
      ```
      npx sequelize-cli db:seed:undo:all
      ```
  * 建立測試環境的 Table
    ```
    NODE_ENV=test npx sequelize db:migrate
    ```

## 執行方式
* 請在 `Console` 輸入下方指令
  * 啟動專案
  ```
  npm run dev
  ```
  * 執行測試
  ```
  npm test
  ```

## 系統網址

* 本地端啟動程式
  * IP Address
    * http://localhost:3000/
  * User
    * Admin
      * Account
        * root@example.com
      * Password
        * 12345678
    * 一般 User
      * Account
        * user1@example.com
      * Password
        * 12345678
* Heroku
  * IP Address
    * https://simple-twitter-projcet.herokuapp.com/
  * User
    * Admin
      * Account
        * root@example.com
      * Password
        * 12345678
    * 一般 User
      * Account
        * user1@example.com
      * Password
        * 12345678

## 功能

* 前台

| 編號 | URI | 說明  |
|:---:|:---:|---|
| 1 | GET / | 轉向 /tweets |
| 2 | GET /tweets | 看見站內所有的推播，以及跟隨者最多的使用者 (設為前台首頁) |
| 3 | POST /tweets | 將新增的推播寫入資料庫 |
| 4 | GET /tweets/:tweet_id/replies | 可以在這頁回覆特定的 tweet，並看見 tweet 主人的簡介 |
| 5 | POST /tweets/:tweet_id/replies | 將回覆的內容寫入資料庫 |
| 6 | GET /users/:id/tweets | 看見某一使用者的推播牆，以及該使用者簡介 |
| 7 | GET /users/:id/followings | 看見某一使用者正在關注的使用者 |
| 8 | GET /users/:id/followers | 看見某一使用者的跟隨者 |
| 9 | POST /followships | 新增一筆 followship 記錄 |
| 10 | DELETE /followships/:followingId | 刪除一筆 followship 記錄 |
| 11 | GET 	/users/:id/likes | 看見某一使用者按過 like 的推播 |
| 12 | POST /tweets/:id/like | 新增一筆 like 記錄 |
| 13 | POST /tweets/:id/unlike | 刪除一筆 like 記錄 |
| 14 | GET /users/:id/edit | 編輯自己的介紹 (表單頁) |
| 15 | POST /users/:id/edit | 編輯自己的介紹 (寫入資料庫) |

* 後台

| 編號 | URI | 說明  |
|:---:|:---:|---|
| 1 | GET /admin/tweets | 看見站內所有的推播 (設為後台首頁) |
| 2 | DELETE /admin/tweets/:id | 刪除其他使用者的推文 |
| 3 | GET /admin/users | 看見站內所有的使用者 |

## Change Logs
* https://github.com/ArcherHuang/simple-twitter-express-starter/commits/master

## Contributor
* [Archer Huang](https://github.com/archerhuang)
* [Jacs](https://github.com/jacs0110)
* [Alvis Hsu](https://github.com/junchoon14)