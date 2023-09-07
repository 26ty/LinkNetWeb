import { Component ,OnInit} from '@angular/core';
import { HttpApiService } from 'src/app/api/http-api.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DateService } from 'src/app/shared/date/date.service';
import Swal from 'sweetalert2'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
    private DateService:DateService,
    private sanitizer: DomSanitizer
  ){}

  a_id:any
  today: any
  userData: any = ""

  /* fake btn status*/
  favorite_status = false
  turned_status = false
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

    //取得單一文章評論
    this.getArticleComments()
  }

  shouldApplyAdaptiveHeight() {
    const content = this.OneArticleDatas.content;
    return content && content.length > 100; // 根据需要调整字数的值
  }

  favoriteBtn(){
    this.favorite_status = !this.favorite_status
  }

  turnedBtn(){
    this.turned_status = !this.turned_status
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

        

        // this.OneArticleDatas.content = this.sanitizer.bypassSecurityTrustHtml(this.OneArticleDatas.content);

        console.log("content",this.OneArticleDatas.content)
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

  //文章評論資料
  commentDatas:any;
  commentTotal:number = 0
  // created_at:any;
  /**
    * 取得所有文章評論data
    *
    * @return {obj} article datas 
  */
  getArticleComments() {
    this.HttpApiService.getArticleCommentsRequest(this.a_id).subscribe(
      res => {
        this.commentDatas = res
        console.log("取得文章評論res",this.commentDatas)
        this.commentTotal = this.commentDatas.length
        console.log("評論數量",this.commentTotal)
        
        // for(let i in this.articleDatas){
        //   if(this.articleDatas[i].img_url != null){
        //     //取得圖片資訊
        //     this.getArticleImageFile(this.articleDatas[i].id,this.articleDatas[i].img_url)
        //   }
        // }
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
  uploadComment() {
    this.uploadCommentData['content'] = this.content
    this.uploadCommentData['article_id'] = this.a_id
    this.uploadCommentData['user_id'] = this.userData.id
    this.uploadCommentData['created_at'] = new Date()
    this.uploadCommentData['updated_at'] = new Date()
    console.log("欲新增文章評論資料", this.uploadCommentData)

    //排除input填空值
    if(this.content.trim() !== '' && this.content != null ){
      this.HttpApiService.uploadCommentRequest(this.uploadCommentData).subscribe(
        res => {
          console.log("新增文章評論res", res)
  
          if (res.status == 200) {
  
            this.content = ''
  
            Swal.fire({
              icon: 'success',
              title: '新增成功!',
              text: "您已成功新增一評論",
              confirmButtonColor: '#1972D6',
              confirmButtonText: '看文章！',
            }).then((result) => {
              if (result.isConfirmed) {
                // window.location.reload()
                this.getArticleComments()
              }
              
  
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
    }else{
      Swal.fire({
        icon: 'error',
        title: '未填寫評論!',
        // text: "請聯絡網管人員.",
        showConfirmButton: false,
        timer: 1500
      })
    }
    
  }

  editStatusBtn = false
  c_id:string = ''
  created_at:any
  PostUpdateCommentData(c_id:string,content:string,created_at:any){
    this.editStatusBtn = true
    this.c_id = c_id
    this.content = content
    this.created_at = created_at
  }
  //編輯評論body
  updateCommentData: any = {}

  /**
    * 編輯文章
    *
    * 
  */
  updateComment() {
    this.updateCommentData['id'] = this.c_id
    this.updateCommentData['content'] = this.content
    this.updateCommentData['user_id'] = this.userData.id
    this.updateCommentData['article_id'] = this.a_id
    this.updateCommentData['created_at'] = new Date(this.created_at)
    this.updateCommentData['updated_at'] = new Date()
    console.log("欲編輯評論資料", this.updateCommentData)
    this.HttpApiService.updateCommentRequest(this.c_id,this.updateCommentData).subscribe(
      res => {
        console.log("編輯評論res", res)
        // if(this.title == res.title){
        if (res.status == 200) {
          this.editStatusBtn = false // 修改編輯按鈕狀態
          this.content = ''
          Swal.fire({
            icon: 'success',
            title: '編輯成功!',
            text: "您已成功編輯評論",
            showConfirmButton: false,
            timer: 1500
          }).then((result) => {
            this.getArticleComments()

          })
        } else {
          Swal.fire({
            icon: 'error',
            title: '編輯存取錯誤!',
            text: "請聯絡網管人員.",
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
          title: '存取錯誤!',
          text: "請聯絡網管人員.",
          showConfirmButton: false,
          timer: 1500
        })
      }
    )
  }

  /**
    * 刪除文章
    * @param  {string} id 填入文章id
  */
  deleteComment(id:string){
    Swal.fire({
      title: "是否確定刪除評論",
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
        this.HttpApiService.deleteCommentRequest(id).subscribe(
          res => {
            console.log("deleteComment",res)
            if(res.statusCode == 200){
              Swal.fire({
                icon: 'success',
                title: "已成功刪除！",
                showConfirmButton: false,
                timer: 1500
              }).then((result) => {
                this.getArticleComments()
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

  goBack() {
    window.history.back();
  }

  
}
