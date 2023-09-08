import { Component ,OnInit} from '@angular/core';
import { HttpApiService } from 'src/app/api/http-api.service';
import { Router } from '@angular/router';
import { DateService} from 'src/app/shared/date/date.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

const USER_KEY = 'auth-user';
@Component({
  selector: 'app-privy',
  templateUrl: './privy.component.html',
  styleUrls: ['./privy.component.css']
})
export class PrivyComponent implements OnInit{

  constructor(
    private router: Router,
    private HttpApiService:HttpApiService,
    private DateService:DateService
  ){}

  userData: any = ""
  today:any
  ngOnInit():void{
    const userLocalData = window.localStorage.getItem(USER_KEY)
    this.userData = JSON.parse(String(userLocalData))
    
    //呼叫取得使用者文章
    this.getUserArticles(this.userData.id)
    this.today = this.DateService.getToday()
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

        for(let i in this.userArticleDatas){
          if(this.userArticleDatas[i].img_url != null){
            //取得圖片資訊
            this.getArticleImageFile(this.userArticleDatas[i].id,this.userArticleDatas[i].img_url)
          }
        }
      },
      err => {
        console.log("存取錯誤!", err)
        console.log("API狀態碼:", err.status);
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

        this.newArticleDatas = this.userArticleDatas.concat();
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
    * 刪除文章
    * @param  {string} id 填入文章id
  */
  deleteArticle(id:string){
    Swal.fire({
      title: "是否確定刪除文章",
      //text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#1972D6',
      cancelButtonText: '取消',
      confirmButtonText: '刪除',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.HttpApiService.deleteArticleRequest(id).subscribe(
          res => {
            console.log("deleteArticle",res)
            if(res.statusCode == 200){
              Swal.fire({
                icon: 'success',
                title: "已成功刪除！",
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.router.navigate(['/main']);
              })
              
            }else{
              Swal.fire({
                icon: 'error',
                title: "刪除失敗！",
                showConfirmButton: false,
                timer: 1500
              })
            }
          },
          err => {
            console.log("存取錯誤!", err)
            console.log("API狀態碼:", err.status);
            Swal.fire({
              icon: 'error',
              title: "刪除失敗！",
              showConfirmButton: false,
              timer: 1500
            })
          }
        )
      }
    })
    
  }

  /**
    * 前往文章細節頁面
  */
  detailArticle(id:string) {
    window.location.assign('/detailArticle/' + id);
  }

  /**
    * 前往文章編輯頁面
  */
  editArticle(id:string) {
    window.location.assign('/editArticle/' + id);
  }

  /**
    * 前往新增文章頁面
  */
  addArticleLink() {
    window.location.assign('/addArticle');
  }
}
