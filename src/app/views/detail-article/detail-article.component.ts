import { Component ,OnInit} from '@angular/core';
import { HttpApiService } from 'src/app/api/http-api.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DateService } from 'src/app/shared/date/date.service';
import Swal from 'sweetalert2'
const USER_KEY = 'auth-user';
@Component({
  selector: 'app-detail-article',
  templateUrl: './detail-article.component.html',
  styleUrls: ['./detail-article.component.css']
})
export class DetailArticleComponent implements OnInit{

  constructor(
    private HttpApiService:HttpApiService,
    private route: ActivatedRoute,
    private router: Router,
    private DateService:DateService
  ){}

  a_id:any
  today: any
  userData: any = ""
  ngOnInit():void{
    this.a_id = this.route.snapshot.paramMap.get('a_id')
    console.log(this.a_id)

    //取得使用者資料
    const userLocalData = localStorage.getItem(USER_KEY)
    this.userData = JSON.parse(String(userLocalData))

    //調用日期服務>取得今日日期與時間
    this.today=this.DateService.getToday();
    console.log(this.today)

    //取得單一文章
    this.getOneArticle(this.a_id)
  }

  OneArticleDatas:any;
  /**
    * 取單一文章data
    *
    * @return {obj} article datas 
  */
  getOneArticle(a_id:string) {
    this.HttpApiService.getOneArticleRequest(a_id).subscribe(
      res => {
        this.OneArticleDatas = res
        console.log("取單一文章data",this.OneArticleDatas)

        //呼叫轉換圖片
        this.getArticleImageFile(this.OneArticleDatas.img_url)
      }
    )
  }

  //取blob:後的URL
  imageUrl:any
  /**
    * 取得圖片
    * @param  {string} a_id 填入文章id
    * @param  {string} imageName 填入欲取得圖片名稱
    * @return {obj} imagePath and other datas 
  */
  getArticleImageFile(imageName:string){
    this.HttpApiService.getArticleImageFileRequest(imageName).subscribe(
      res => {
        console.log("取得圖片res",res);
        // 設置 blob 的類型為圖像的 MIME 類型
        const blob = new Blob([res], { type: 'image/jpeg' }); 
        // 使用 blob 創建圖像 URL
        this.imageUrl = URL.createObjectURL(blob); 
        console.log("取blob:後的URL",this.imageUrl)

        //新圖片網址URL取代原文章圖片網址
        this.OneArticleDatas.img_url = this.imageUrl

      },
      err => {
        console.log("存取錯誤!", err)
        console.log("API狀態碼:", err.status);
      }
    )
  }

  //評論body
  content:string = ''
  uploadCommentData:any = {}

  /**
    * 新增文章評論
    * 
    * @param {obj} uploadCommentData and other datas 
  */
  uploadArticle() {
    this.uploadCommentData['content'] = this.content
    this.uploadCommentData['article_id'] = this.a_id
    this.uploadCommentData['user_id'] = this.userData.id
    this.uploadCommentData['created_at'] = new Date()
    this.uploadCommentData['updated_at'] = new Date()
    console.log("欲新增文章評論資料", this.uploadCommentData)
    this.HttpApiService.uploadCommentRequest(this.uploadCommentData).subscribe(
      res => {
        console.log("新增文章評論res", res)

        if (res.status == 200) {
          Swal.fire({
            icon: 'success',
            title: '新增成功!',
            text: "您已成功新增一評論",
            confirmButtonColor: '#1972D6',
            confirmButtonText: '看文章！',
          }).then((result) => {
            this.router.navigate([`/detailArticle/${this.a_id}`]);

          })
        } else {
          Swal.fire({
            icon: 'error',
            title: '存取錯誤!',
            text: "請聯絡網管人員.",
            showConfirmButton: false,
            timer: 1500
          })
        }
      },
      err => {
        console.log("存取錯誤!", err)
        console.log("API狀態碼:", err.status);
      }
    )
  }
  goBack() {
    window.history.back();
  }

  
}
