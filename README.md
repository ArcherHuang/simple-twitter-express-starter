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
- [畫面](#畫面)
- [Change Logs](#change-logs)
- [Contributor](#contributor)

## 簡介


## 環境建置與需求


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
    * 
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

| 編號 | 功能 | 說明  |
|:---:|:---:|---|

## 畫面



## Change Logs



## Contributor
* [Archer Huang](https://github.com/archerhuang)
* [Jacs](https://github.com/jacs0110)
* [Alvis Hsu](https://github.com/junchoon14)