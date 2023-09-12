import { Component ,OnInit} from '@angular/core';
import { HttpApiService } from 'src/app/api/http-api.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
const USER_KEY = 'auth-user';
@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit{

  constructor(
    private HttpApiService: HttpApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  today: any
  userData: any = ""
  ngOnInit():void{
    //取得使用者資料
    const userLocalData = localStorage.getItem(USER_KEY)
    this.userData = JSON.parse(String(userLocalData))

    //取得個人收藏文章
    this.getUserCollection()
  }
  
  //個人收藏資料
  collectionDatas: any;
  //顯示收藏文章資料
  dispalyCollectionArticleDatas :any= []
  /**
    * 取得使用者收藏文章評論data
    *
    * @return {obj} article datas 
  */
  getUserCollection() {
    this.HttpApiService.getUserCollectionRequest(this.userData.id).subscribe(
      res => {
        this.collectionDatas = res
        console.log("取得個人收藏文章res", this.collectionDatas)

        //a_id list
        var CollectionArticleIdList = [] 
        for(let i in this.collectionDatas){
          CollectionArticleIdList.push(this.collectionDatas[i].article_id)
        }

        //去除相同a_id list
        var uniqueCollectionArticleId = Array.from(new Set(CollectionArticleIdList));
        console.log("去除相同a_id List",uniqueCollectionArticleId)

        //呼叫取得該文章
        for(let i in uniqueCollectionArticleId){
          this.getOneArticle(uniqueCollectionArticleId[i])
        }

      },
      err => {
        console.log("存取錯誤!", err)
        console.log("API狀態碼:", err.status);
      }
    )
  }

  OneArticleDatas: any;
  /**
    * 取單一文章data
    *
    * @return {obj} article datas 
  */
  getOneArticle(a_id: string) {
    this.HttpApiService.getOneArticleRequest(a_id).subscribe(
      res => {
        this.OneArticleDatas = res
        console.log("取單一文章data", this.OneArticleDatas)

        //呼叫轉換圖片
        this.getArticleImageFile(this.OneArticleDatas.img_url)
        
        this.dispalyCollectionArticleDatas.push(this.OneArticleDatas)
        console.log("顯示收藏文章資料",this.dispalyCollectionArticleDatas)
        
      }
    )
  }

  //取blob:後的URL
  imageUrl: any
  /**
    * 取得圖片
    * @param  {string} a_id 填入文章id
    * @param  {string} imageName 填入欲取得圖片名稱
    * @return {obj} imagePath and other datas 
  */
  getArticleImageFile(imageName: string) {
    this.HttpApiService.getArticleImageFileRequest(imageName).subscribe(
      res => {
        console.log("取得圖片res", res);
        // 設置 blob 的類型為圖像的 MIME 類型
        const blob = new Blob([res], { type: 'image/jpeg' });
        // 使用 blob 創建圖像 URL
        this.imageUrl = URL.createObjectURL(blob);
        console.log("取blob:後的URL", this.imageUrl)

        //新圖片網址URL取代原文章圖片網址
        this.OneArticleDatas.img_url = this.imageUrl

      },
      err => {
        console.log("存取錯誤!", err)
        console.log("API狀態碼:", err.status);
      }
    )
  }

  detailArticle() {
    window.location.assign('/detailArticle');
  }

  goBack() {
    window.history.back();
  }
}
