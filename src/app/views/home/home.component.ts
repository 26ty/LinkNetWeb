import { Component ,OnInit} from '@angular/core';
import { HttpApiService } from 'src/app/api/http-api.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  constructor(
    private HttpApiService:HttpApiService
  ){}

  ngOnInit():void{

    //呼叫取得所有文章
    this.getAllArticle()
    const p:any = document.getElementById('article-content')
    // this.limitText(p,20)

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

  articleDatas:any;
  /**
    * 取得所有文章data
    *
    * @return {obj} article datas 
  */
  getAllArticle() {
    this.HttpApiService.getArticleRequest().subscribe(
      res => {
        this.articleDatas = res
        console.log("取得所有文章res",this.articleDatas)
      }
    )
  }

  // p = document.getElementById('article-content');
  /**
    * 限制<p>內字數顯示
    * @param limit 限制字數
    * @return {obj} article datas 
  */
  limitText(p:HTMLElement,limit:number):void {
    const text:any = p.textContent?.trim();
    if (text.length > limit) {
      const truncated: string = text.slice(0, limit) + '...';
      p.textContent = truncated;
    }
  }

  /**
    * 查看文章內容
  */
  detailArticle(id:string) {
    window.location.assign('/detailArticle/' + id);
  }

  /**
    * 前往新增文章頁面
  */
  addArticleLink() {
    window.location.assign('/addArticle');
  }
}
