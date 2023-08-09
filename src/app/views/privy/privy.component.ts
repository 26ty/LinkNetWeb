import { Component ,OnInit} from '@angular/core';
import { HttpApiService } from 'src/app/api/http-api.service';
import { Router } from '@angular/router';

const USER_KEY = 'auth-user';
@Component({
  selector: 'app-privy',
  templateUrl: './privy.component.html',
  styleUrls: ['./privy.component.css']
})
export class PrivyComponent implements OnInit{

  constructor(
    private router: Router,
    private HttpApiService:HttpApiService
  ){}

  userData: any = ""
  ngOnInit():void{
    const userLocalData = window.localStorage.getItem(USER_KEY)
    this.userData = JSON.parse(String(userLocalData))
    
    //呼叫取得使用者文章
    this.getUserArticles(this.userData.id)
    this.getToday()
  }

  today:any
  /**
    * 取得現在日期與時間
    *
    * @return {string} time datas 
  */
  getToday(){
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    this.today = `${year}年${month}月${day}日`;
    console.log(this.today);
  }

  userArticleDatas:any;
  /**
    * 取得user所有文章data
    *
    * @return {obj} user article datas 
  */
  getUserArticles(user_id:string) {
    this.HttpApiService.getUserArticlesRequest(user_id).subscribe(
      res => {
        this.userArticleDatas = res
        console.log("取得user所有文章res",this.userArticleDatas)
      }
    )
  }

  detailArticle(id:string) {
    window.location.assign('/detailArticle/' + id);
  }

}
