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
    this.getAllArticle()
    const p:any = document.getElementById('article-content')
    // this.limitText(p,20)

    this.getToday()
  }

  today:any
  getToday(){
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    this.today = `${year}年${month}月${day}日`;
    console.log(this.today);
  }
  
   // 输出当前日期

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
        console.log(this.articleDatas)
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

  detailArticle(id:string) {
    window.location.assign('/detailArticle/' + id);
  }
}
