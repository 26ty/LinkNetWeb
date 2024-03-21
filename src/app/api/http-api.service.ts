import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; //http協定
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, map, tap } from 'rxjs/operators';// RxJS 可觀察物件和運算子
import { Router } from '@angular/router';

//model
import { Article } from '../shared/models/article-data';
import { Users } from '../shared/models/user-data';
import { Comment } from '../shared/models/comment-data';
import { Collection } from '../shared/models/comment-data';
import { UsersLogin } from '../shared/models/user-data';
//location


const USER_KEY = 'auth-user';//儲存使用者資料
declare const navigator: Navigator;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})


export class HttpApiService {

  private BaseUrl: string = 'https://localhost:7086/api';
  // private WeatherUrl: string = 'https://opendata.cwb.gov.tw/api';
  private WeatherUrl: string = '/api';
  private WeatherApiKey:string = 'CWA-D94615CC-D833-4DAF-8353-F58E19EE113A';
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  // saveUser(user: Users): void {
  //   const userStr = JSON.stringify(user);
  //   window.localStorage.removeItem(USER_KEY);
  //   window.localStorage.setItem(USER_KEY, userStr);
  // }
  /* Weather  -------------------------------------------------------------*/

  /**
    * 以經緯度轉換地理位置
  */
  latitude=23.090223155174623
  longitude=120.27725353858409
  getLocation() : Observable<any>{
    //創建Observable對象
    return new Observable((observer) => {
      //檢查瀏覽器是否支援地理定位
      if (navigator.geolocation) {
        //使用瀏覽器的地理定位API getCurrentPosition方法來獲取user的當前位置
        navigator.geolocation.getCurrentPosition(
          //成功獲取位置 position包含獲取的位置訊息
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log('Latitude 緯度:', latitude);
            console.log('Longitude 經度:', longitude);
            // 在這裡處理位置信息
            const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
            this.http.get(url).subscribe(
              (response) => {
                observer.next(response);
                observer.complete();
              },
              (error) => {
                observer.error(error);
              }
            );
          },
          (error) => {
            console.log('無法獲取位置:', error);
            observer.error(error);
          }
        );
      } else {
        console.log('您的瀏覽器不支援地理定位。');
        observer.error('瀏覽器不支援地理定位');
      }
    });
  }

  locationReverse(latitude:number,longitude:number): Observable<any>{
    const url =`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    return this.http.get(url)
  }

  /**
    * 取得一般天氣預報－今明36小時天氣預報
    * @param elementName 欲取得資訊 天氣因子ex:Wx
    * @param locationName 填入臺灣各縣市 ex:臺南市
    * @return {obj} weather datas
  */
  getForcastWeather(locationName:string,elementName?:string): Observable<any> {
    const url = `${this.WeatherUrl}/v1/rest/datastore/F-C0032-001?Authorization=${this.WeatherApiKey}&locationName=${locationName}&elementName=${elementName}`
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json') // 替换为您要添加的字段和数据
      .set('Authorization', this.WeatherApiKey);
    const options = { headers: headers };
    return this.http.get(url,options)
  }

  /**
    * 取得現在天氣觀測報告
    * @param elementName 欲取得資訊 ex:TEMP
    * @param locationName 填入氣象站 ex:臺南 可參考 https://e-service.cwb.gov.tw/wdps/obs/state.htm
    * @return {obj} weather datas
  */
  getNowWeather(locationName:string,elementName?:string): Observable<any> {
    const url = `${this.WeatherUrl}/v1/rest/datastore/O-A0003-001?Authorization=${this.WeatherApiKey}&locationName=${locationName}&elementName=${elementName}`
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json') // 替换为您要添加的字段和数据
      .set('Authorization', this.WeatherApiKey);
    const options = { headers: headers };
    return this.http.get(url,options)
  }

  /* 登入  -------------------------------------------------------------*/
  login(body: UsersLogin) : Observable<any> {
    const url = `${this.BaseUrl}/Login`;
    return this.http.post(url, body);
  }

  /* 存使用者資料至本地端 */
  saveUser(user: Users): void {
    const userStr = JSON.stringify(user);
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, userStr);
    // window.location.reload()
  }

  /* 至本地端存取使用者資料 */
  getUser(): string | null {
    return window.localStorage.getItem(USER_KEY);
  }

  /* 登出 */
  signOut(): void {
    window.localStorage.clear();
  }

  logout() : void{
    this.signOut();
    this.router.navigate(['/']);
  }

  /* User CR -------------------------------------------------------------*/
  /**
    * 取得所有使用者data
    *
    * @return {obj} User datas
  */
  getUserRequest() : Observable<any> {
    return this.http.get(this.BaseUrl + '/Users');
  }

  /**
    * 取得單一使用者data
    * @param  {string} 填入欲取得的使用者id
    * @return {obj} User datas
  */
  getOneUserRequest(id: string): Observable<any> {
    const url = `${this.BaseUrl}/Users/${id}`;
    return this.http.get(url);
  }

  /**
    * 新增使用者
    * @param  {Comment} 填入body obj
    * @return {obj} User datas
  */
  uploadUserRequest(body: Comment) : Observable<any>{
    const url = `${this.BaseUrl}/Users`;
    return this.http.post(url, body);
  }

  /* Article CRUD -------------------------------------------------------*/
  /**
    * 取得所有文章data
    *
    * @return {obj} article datas
  */
  getArticleRequest() : Observable<any> {
    return this.http.get(this.BaseUrl + '/Articles');
  }

  /**
    * 取得單一文章data
    * @param  {string} 填入欲取得的文章id
    * @return {obj} article datas
  */
  getOneArticleRequest(id: string): Observable<any> {
    const url = `${this.BaseUrl}/Articles/${id}`;
    return this.http.get(url);
  }

  /**
    * 新增文章
    * @param  {Article} 填入body obj
    * @return {obj} article datas
  */
  uploadArticleRequest(body: Article) : Observable<any>{
    const url = `${this.BaseUrl}/Articles`;
    return this.http.post(url, body);
  }

  /**
    * 更新文章
    * @param  {Article} 填入body obj
    * @return {obj} article datas
  */
  updateArticleRequest(id:string,body: Article) : Observable<any>{
    const url = `${this.BaseUrl}/Articles/${id}`;
    return this.http.put(url, body);
  }

  /**
    * 刪除單一文章data
    * @param  {string} 填入欲刪除的文章id
    * @return {obj} article datas
  */
  deleteArticleRequest(id: string) : Observable<any> {
    const url = `${this.BaseUrl}/Articles/${id}`;
    return this.http.delete(url);
  }

  /**
    * 取得該user_id的文章列表
    * @param  {string} 填入user_id
    * @return {obj} article datas
  */
  getUserArticlesRequest(user_id: string): Observable<any> {
    const url = `${this.BaseUrl}/Articles/getUserArticles/${user_id}`;
    return this.http.get(url);
  }

  /**
    * 取得指定數量隨機文章列表
    * @param  {string} count
    * @return {obj} article datas
  */
  getRandomArticlesRequest(count?:number): Observable<any> {
    const url = `${this.BaseUrl}/Articles/getRandomArticles/${count}`;
    return this.http.get(url);
  }

  /**
    * 新增文章圖片檔案
    * @param  {string} 填入body obj
    * @return {obj} imagePath and other datas
  */
  uploadArticleImageFileRequest(body: any) : Observable<any>{
    const url = `${this.BaseUrl}/Articles/uploadImageFile`;
    return this.http.post(url, body);
  }


  /**
    * 取得所有文章圖片data
    *
    * @param {string} imageName datas
  */
  getArticleImageFileRequest(imageName:string) : Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'blob');
    return this.http.get(this.BaseUrl + '/Articles/getImageFile/' + imageName,{ responseType: 'blob' });
  }

  /* Comment CRUD ------------------------------------------------------------*/
  /**
    * 取得所有評論data
    *
    * @return {obj} article datas
  */
  getCommentRequest() : Observable<any> {
    return this.http.get(this.BaseUrl + '/Comments');
  }

  /**
    * 取得單一評論data
    * @param  {string} 填入欲取得的評論id
    * @return {obj} Comment datas
  */
  getOneCommentRequest(id: string): Observable<any> {
    const url = `${this.BaseUrl}/Comments/${id}`;
    return this.http.get(url);
  }

  /**
    * 取得單一文章評論data
    * @param  {string} 填入欲取得評論的文章id
    * @return {obj} Comment datas
  */
  getArticleCommentsRequest(article_id: string): Observable<any> {
    const url = `${this.BaseUrl}/Comments/getArticleComments/${article_id}`;
    return this.http.get(url);
  }

  /**
    * 新增評論
    * @param  {Comment} 填入body obj
    * @return {obj} Comment datas
  */
  uploadCommentRequest(body: Comment) : Observable<any>{
    const url = `${this.BaseUrl}/Comments`;
    return this.http.post(url, body);
  }

  /**
    * 更新評論
    * @param  {Comment} 填入body obj
    * @return {obj} Comment datas
  */
  updateCommentRequest(id:string,body: Comment) : Observable<any>{
    const url = `${this.BaseUrl}/Comments/${id}`;
    return this.http.put(url, body);
  }

  /**
    * 刪除單一評論data
    * @param  {string} 填入欲刪除的評論id
    * @return {obj} Comment datas
  */
  deleteCommentRequest(id: string) : Observable<any>{
    const url = `${this.BaseUrl}/Comments/${id}`;
    return this.http.delete(url);
  }

  /* Collection CRUD ------------------------------------------------------------*/
  /**
    * 取得所有收藏data
    *
    * @return {obj} collection datas
  */
  getCollectionRequest() : Observable<any> {
    return this.http.get(this.BaseUrl + '/Collections');
  }

  /**
    * 取得User收藏data
    *
    * @return {obj} collection datas
  */
  getUserCollectionRequest(user_id:string) : Observable<any> {
    return this.http.get(this.BaseUrl + `/Collections/getUserCollections/${user_id}`);
  }

  /**
    * 取得單一收藏data
    * @param  {string} 填入欲取得的收藏id
    * @return {obj} Collection datas
  */
  getOneCollectionRequest(id: string): Observable<any> {
    const url = `${this.BaseUrl}/Collections/${id}`;
    return this.http.get(url);
  }

  /**
    * 新增收藏
    * @param  {Collection} 填入body obj
    * @return {obj} Collection datas
  */
  uploadCollectionRequest(body: Collection) : Observable<any>{
    const url = `${this.BaseUrl}/Collections`;
    return this.http.post(url, body);
  }

  /**
    * 更新收藏
    * @param  {Collection} 填入body obj
    * @return {obj} Comment datas
  */
  updateCollectionRequest(id:string,body: Collection) : Observable<any>{
    const url = `${this.BaseUrl}/Collections/${id}`;
    return this.http.put(url, body);
  }

  /**
    * 刪除單一收藏data
    * @param  {string} 填入欲刪除的收藏id
    * @return {obj} Comment datas
  */
  deleteCollectionRequest(id: string) : Observable<any>{
    const url = `${this.BaseUrl}/Collections/${id}`;
    return this.http.delete(url);
  }
}
