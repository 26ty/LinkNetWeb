import { Component,OnInit } from '@angular/core';
import { HttpApiService } from 'src/app/api/http-api.service';
import { DateService } from 'src/app/shared/date/date.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'
const USER_KEY = 'auth-user';
@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})
export class EditArticleComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private HttpApiService: HttpApiService,
    private DateService:DateService
  ){ }

  //網址列a_id
  a_id:any

  today: any
  userData: any = ""
  ngOnInit():void{
    const userLocalData = localStorage.getItem(USER_KEY)
    this.userData = JSON.parse(String(userLocalData))

    this.today=this.DateService.getToday();
    console.log(this.today)

    //取網址列a_id
    this.a_id = this.route.snapshot.paramMap.get('a_id')
    console.log(this.a_id)

    //呼叫取得單一文章
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

        this.title = this.OneArticleDatas.title
        this.content = this.OneArticleDatas.content
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

  //文章body
  title: string = ''
  content: string = ''
  img_url: any
  user_id: string = ''
  updateArticleData: any = {}


  goBack() {
    window.history.back();
  }
}
