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
  login():void{

  }

  /* Article CRUD */
  /**
    * 取得所有文章data
    *
    * @return {obj} article datas 
  */
  getArticleRequest() : Observable<any> {
    return this.http.get(this.BaseUrl + '/Articles');
  }

  /**
    * 更新文章
    * @param  {Article} 填入body obj
    * @return {obj} article datas 
  */
  uploadArticleRequest(body: Article) : Observable<any>{
    const url = `${this.BaseUrl}/Articles`;
    return this.http.post(url, body);
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
    * 刪除單一文章data
    * @param  {string} 填入欲刪除的文章id
    * @return {obj} article datas 
  */
  deleteArticleRequest(id: string) {
    const url = `${this.BaseUrl}/Articles/${id}`;
    return this.http.delete(url);
  }


}
