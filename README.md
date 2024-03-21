# LinkNetWeb

#### 社群平台留言板主題資料表設計ER-Model:
![](https://hackmd.io/_uploads/Byw8cTx23.png)
1. User(使用者)表格

欄位名稱 | 資料類型 | 說明
--- | --- | ---
id | INTEGER | 使用者ID，主鍵
username | VARCHAR(50) | 使用者名稱，唯一
password | VARCHAR(100) | 使用者密碼
email | VARCHAR(50) | 使用者電子郵件，唯一
avatar | VARCHAR(255) | 使用者頭像圖片路徑
created_at | TIMESTAMP | 使用者建立時間
updated_at | TIMESTAMP | 使用者最近更新時間

2. Article(文章)表格

欄位名稱 | 資料類型 | 說明
--- | --- | ---
id | VARCHAR2(80) | 文章ID，主鍵
title | VARCHAR2(80) | 文章標題
content | CLOB | 文章內容
img_url | varchar1(80) | 文章圖片
user_id | INTEGER | 作者ID，外鍵參考User表格的id欄位
created_at | VARCHAR2(80) | 文章建立時間
updated_at | TIMESTAMP | 文章最近更新時間

3. Comment(回覆)表格

欄位名稱 | 資料類型 | 說明
--- | --- | ---
id | INTEGER | 回覆ID，主鍵
content | TEXT | 回覆內容
user_id | INTEGER | 回覆者ID，外鍵參考User表格的id欄位
article_id | INTEGER | 回覆對應的文章ID，外鍵參考Article表格的id欄位
created_at | TIMESTAMP | 回覆建立時間
updated_at | TIMESTAMP | 回覆最近更新時間

### 社群平台留言板[LinkNet]
#### 目前進度
1. 資料庫及資料表已建立
2. asp.net core web api 已建立crud controller
3. Angular已串接註冊/登入，取得所有／個人文章，上傳文章

![image](https://github.com/26ty/LinkNetWeb/assets/69799370/0d8058ab-57a0-42d1-822b-feb14d0e88ef)

![image](https://github.com/26ty/LinkNetWeb/assets/69799370/fb7f4a52-b687-41b8-bfda-e3c61bde78b2)

![image](https://github.com/26ty/LinkNetWeb/assets/69799370/b362f942-f191-4c8d-8227-6bd5af3dad0f)

![image](https://github.com/26ty/LinkNetWeb/assets/69799370/679e6e7a-70fd-4383-9a64-68af7c5e9019)
![image](https://github.com/26ty/LinkNetWeb/assets/69799370/e9837759-2e51-4a5d-9d1c-c5bceeb3cf85)
![image](https://github.com/26ty/LinkNetWeb/assets/69799370/99aefbee-b57e-496a-a611-f802ea22a06d)

![image](https://github.com/26ty/LinkNetWeb/assets/69799370/7f1d419d-0e86-4a73-899d-ae7a7bbcb767)

