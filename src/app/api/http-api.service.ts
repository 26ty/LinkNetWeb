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
import { UsersLogin } from '../shared/models/user-data';

const USER_KEY = 'auth-user';//儲存使用者資料

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})


export class HttpApiService {

  private BaseUrl: string = 'https://localhost:7086/api';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  // saveUser(user: Users): void {
  //   const userStr = JSON.stringify(user);
  //   window.localStorage.removeItem(USER_KEY);
  //   window.localStorage.setItem(USER_KEY, userStr);
  // }

  /* 登入 */
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
  updateCommentRequest(body: Comment) : Observable<any>{
    const url = `${this.BaseUrl}/Comments`;
    return this.http.put(url, body);
  }

  /**
    * 刪除單一評論data
    * @param  {string} 填入欲刪除的評論id
    * @return {obj} Comment datas 
  */
  deleteCommentRequest(id: string) {
    const url = `${this.BaseUrl}/Comments/${id}`;
    return this.http.delete(url);
  }

}
