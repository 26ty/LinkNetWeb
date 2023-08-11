import { Component ,OnInit} from '@angular/core';
import { HttpApiService } from 'src/app/api/http-api.service';
import { DateService } from 'src/app/shared/date/date.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  constructor(
    private HttpApiService:HttpApiService,
    private DateService:DateService
  ){}

  today:any
  ngOnInit():void{

    //呼叫取得所有文章
    this.getAllArticle()
    const p:any = document.getElementById('article-content')
    // this.limitText(p,20)

    this.today = this.DateService.getToday()
  }

  
  //所有文章資料
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

        for(let i in this.articleDatas){
          if(this.articleDatas[i].img_url != null){
            //取得圖片資訊
            this.getArticleImageFile(this.articleDatas[i].id,this.articleDatas[i].img_url)
          }
        }
      }
    )
  }

  //取blob:後的URL
  imageUrl:any
  //轉換過的url及其對應id陣列
  articleImageDataList:any[]=[];
  //交換完圖片網址的所有文章資料
  newArticleDatas:any
  /**
    * 取得圖片
    * @param  {string} a_id 填入文章id
    * @param  {string} imageName 填入欲取得圖片名稱
    * @return {obj} imagePath and other datas 
  */
  getArticleImageFile(a_id:string,imageName:string){
    this.HttpApiService.getArticleImageFileRequest(imageName).subscribe(
      res => {
        console.log("取得圖片res",res);
        // 設置 blob 的類型為圖像的 MIME 類型
        const blob = new Blob([res], { type: 'image/jpeg' }); 
        // 使用 blob 創建圖像 URL
        this.imageUrl = URL.createObjectURL(blob); 
        console.log("取blob:後的URL",this.imageUrl)

        // 設置[轉換過的url及其對應id陣列]
        this.articleImageDataList.push( { "id" : a_id , "img_url" : this.imageUrl } ) //轉換過的url及其對應id陣列
        console.log("轉換過的url及其對應id陣列",this.articleImageDataList)

        this.newArticleDatas = this.articleDatas.concat();
        for(let i in this.newArticleDatas){
          for(let j in this.articleImageDataList){
            if(this.newArticleDatas[i].id== this.articleImageDataList[j].id){
              this.newArticleDatas[i].img_url = this.articleImageDataList[j].img_url;
            }
          }
        }

        console.log("交換完圖片網址的所有文章資料",this.newArticleDatas)
      },
      err => {
        console.log("存取錯誤!", err)
        console.log("API狀態碼:", err.status);
      }
    )
  }

  /**
   * 提取字符串中第一个":"后面的值
   * @param {string} str 欲切割的字串 
   * @returns {string} str 第一個“:”後的字串值
   */
  extractValue(str: string): string {
    const index = str.indexOf(':');
    if (index !== -1) {
      return str.slice(index + 1).trim();
    } else {
      return '';
    }
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
