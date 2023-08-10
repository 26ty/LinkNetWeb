import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpApiService } from 'src/app/api/http-api.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'
const USER_KEY = 'auth-user';
@Component({
  selector: 'app-add-articletextarea[autoresize]',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private HttpApiService: HttpApiService
  ) { }

  userData: any = ""
  ngOnInit(): void {
    const userLocalData = localStorage.getItem(USER_KEY)
    this.userData = JSON.parse(String(userLocalData))

    this.getToday()
  }

  /**
    * 登入函式
  */
  today: any
  getToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    this.today = `${year}年${month}月${day}日`;
    console.log(this.today);
  }

  //文章body
  title: string = ''
  content: string = ''
  img_url: any
  user_id: string = ''
  uploadArticleData: any = {}



  // 将图像文件转换为Base64字符串
  convertImageToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // 选择图像文件后，调用此方法进行转换并将Base64字符串存储到数据库
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.convertImageToBase64(file).then((base64String: string) => {
        this.img_url = base64String;
        console.log("圖片網址",this.img_url)
      }).catch(error => {
        console.error('Error converting image to Base64:', error);
      });
    }
  }
  /**
    * 新增文章
    *
    * 
  */
  uploadArticle() {
    this.uploadArticleData['title'] = this.title
    this.uploadArticleData['content'] = this.content
    this.uploadArticleData['img_url'] = null
    this.uploadArticleData['user_id'] = this.userData.id
    this.uploadArticleData['created_at'] = new Date()
    this.uploadArticleData['updated_at'] = new Date()
    console.log("欲新增文章資料", this.uploadArticleData)
    this.HttpApiService.uploadArticleRequest(this.uploadArticleData).subscribe(
      res => {
        console.log("新增使用者res", res)
        // if(this.title == res.title){
        if (res.status == 200) {
          Swal.fire({
            icon: 'success',
            title: '新增成功!',
            text: "您已成功新增一篇文章",
            confirmButtonColor: '#1972D6',
            confirmButtonText: '看文章！',
          }).then((result) => {
            this.router.navigate(['/main']);

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
}
