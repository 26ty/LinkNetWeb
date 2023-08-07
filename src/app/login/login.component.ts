import { Component , OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpApiService } from '../api/http-api.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  hide = true;

  // loginForm: FormGroup;
  username:string='';
  password:string='';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private HttpApiService: HttpApiService,
  ){
    // this.loginForm = this.fb.group({
    //   username:['', [Validators.required]],
    //   password:['', [Validators.required]]
    // })
  }

  ngOnInit():void{

    this.getToday()

    // this.loginForm = new FormGroup({
    //   username : new FormControl(),
    //   password : new FormControl()
    // })

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

  loginUserData:any= {}
  /**
    * 登入函式
  */
  login(){
    console.log(this.username,this.password)

    this.loginUserData['username'] = this.username
    this.loginUserData['password'] = this.password
    console.log(this.loginUserData)
    this.HttpApiService.login(this.loginUserData).subscribe(
      res => {
        console.log("登入request",res)
        if(res.code == 200){

          //若登入成功則使用userId取得該使用者資料
          this.getOneUserData(res.userId,res.message)
        }
      },
      err => {
        console.log("登入錯誤",err)
        //根據錯誤碼對應提示彈跳視窗
        this.LoginErrorStatus(err.error.code,err.error.message)
      }
    )

  }

  userDatasList: any = {}
  /**
    * 取得單一使用者data
    *
    * @param {any} user_id 填入欲取得的使用者id
  */
  getOneUserData(user_id:string,message:string){
    this.HttpApiService.getOneUserRequest(user_id).subscribe(
      res => {
        console.log("取得單一使用者data",res)
        this.userDatasList['username'] = res.username
        this.userDatasList['email'] = res.email
        this.userDatasList['id'] = res.id
        console.log("要存入local的使用者資訊",this.userDatasList)

        //存入local
        this.HttpApiService.saveUser(this.userDatasList)
        //跳轉至首頁
        this.router.navigateByUrl(`/main`);
        
        Swal.fire({
          icon: 'success',
          title: message,
          showConfirmButton: false,
          timer: 1500
        })
      },
      err => {
        console.log("存取錯誤!",err)
        this.LoginErrorStatus(err.error.code,err.error.message)
      }
    )

  }

  uploadUserData:any={}
  /**
    * 新增使用者
    *
    * 
  */
  registry(){
    this.uploadUserData['username'] = this.username
    this.uploadUserData['email'] = this.email
    this.uploadUserData['password'] = this.password
    this.uploadUserData['created_at'] = new Date()
    this.uploadUserData['updated_at'] = new Date()

    console.log("欲新增使用者資料",this.uploadUserData)
    this.HttpApiService.uploadUserRequest(this.uploadUserData).subscribe(
      res => {
        console.log("新增使用者res",res)
        if(this.username == res.username){
          Swal.fire({
            icon: 'success',
            title: '註冊成功!',
            text: "您已加入LinkNet會員",
            confirmButtonColor: '#1972D6',
            confirmButtonText: '登入',
          }).then((result) => {
            if (result.isConfirmed) {
              this.registryStatus = true
              this.login()
            }
          })
        }
      },
      err => {
        console.log("存取錯誤!",err)
        this.LoginErrorStatus(err.error.code,err.error.message)
      }
    )
  }

  registryStatus:boolean=false
  email:string='';
  /**
    * 登入錯誤代碼對應的提示視窗
    *
    * @param {any} code api錯誤代碼 ex:400 
    * @param {any} message api錯誤訊息 ex:未輸入帳號或密碼！
  */
  LoginErrorStatus(code:any,message:any){
    if(code == 400){ //未輸入帳號或密碼
      Swal.fire({
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 1500
      })
    }else if(code == 422){ //無此帳號，是否要進行註冊？
      Swal.fire({
        title: message,
        //text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonColor: '#1972D6',
        cancelButtonText: '取消',
        confirmButtonText: '註冊',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.registryStatus = true
          //this.registry()
          // Swal.fire({
          //   icon: 'success',
          //   title: '註冊成功!',
          //   text: "您已加入LinkNet會員",
          //   confirmButtonColor: '#1972D6',
          //   confirmButtonText: '登入',
          // })
          //註冊流程api
        }
      })
    }else if(code == 401){ //密碼錯誤
      Swal.fire({
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 1500
      })
    }else if(code == 500){ //伺服器無連線，請聯絡伺服器管理人員
      Swal.fire({
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 1500
      })
    }else{ //未知錯誤
      Swal.fire({
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 1500
      })
    }
    
  }


  


}
