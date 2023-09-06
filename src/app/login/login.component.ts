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

    this.getQRCode()
  }

  /**
    * 取得今日日期
  */
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
        // this.router.navigateByUrl(`/main`);
        // this.router.navigate(['/main']);

        this.router.navigate(['/main']).then(() => {
          Swal.fire({
            icon: 'success',
            title: message,
            showConfirmButton: false,
            timer: 1500
          }).then(() =>{
            // 重新載入页面
            location.reload()
          })
          
          
        });
        
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
        // if(this.username == res.user.username){
        if(res.status == 200){
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
        }else{
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
        console.log("存取錯誤!",err)
        console.log("API狀態碼:", err.status);
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

      this.password='';
    }else if(code == 500){ //伺服器無連線，請聯絡伺服器管理人員
      Swal.fire({
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 1500
      })

      this.password='';
    }else{ //未知錯誤
      Swal.fire({
        icon: 'error',
        title: "伺服器未開啟！",
        showConfirmButton: false,
        timer: 1500
      })

      this.password='';
    }
    
  }


  /* web Fido test-------------------------------------------------- */

  source:any;
  apim_id = 'aa354322-7e55-4d7d-9d9d-9ca31924b6e6';
  ad = ''; // 登入者的AD帳號
  qrCodeUrl:string = ''
  successLoginData :any

  getQRCode(): void {
    if (this.source != null) {
      this.source.close();
    }
  
    this.connectEventSource();
  }
  
  connectEventSource(): void {
    this.source = new EventSource(`https://apim.innolux.com/b4f570a1-1014-4525-ad1f-a735c7dde55e?apim_id=${this.apim_id}&ad=${this.ad}`);
  
    this.source.onopen = function (e: Event): void {
      console.log("連線打開");
    };
  
    this.source.onclose = function (e: Event): void {
      console.log("連線關閉");
    };
  
    this.source.onerror = function (e: Event): void {
      console.log("發生錯誤");
      this.source!.close();
    };
  
    this.source.onmessage = (event: MessageEvent): void => {
      console.log(event.data);
  
      const data = JSON.parse(event.data) as {
        type: string;
        message?: string;
        token?: string;
        refresh_token?: string;
        emp_no?: string;
        expire?: string;
      };
  
      //將成功登入後回傳的data存入陣列
      this.successLoginData = data;

      if (data.type == 'qrcode') {
        this.showQRCode("data:image/png;base64, " + this.decode(data.message!));
      } else if (data.type == 'qrcodeIsScan') {
        this.qrcodeIsScan();
      } else if (data.type == 'loginSuccess') {
        this.loginSuccess(data.token!, data.refresh_token!, data.emp_no!, data.expire!);
        this.source!.close();
      } else if (data.type == 'error') {
        this.error(data.message!);
        this.source!.close();
      }
    };
  }
  
  decode(input: string): string {
    // Replace non-url compatible chars with base64 standard chars
    input = input.replace(/-/g, '+').replace(/_/g, '/');
  
    // Pad out with standard base64 required padding characters
    const pad = input.length % 4;
    if (pad) {
      if (pad === 1) {
        throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
      }
      input += new Array(5 - pad).join('=');
    }
  
    return input;
  };
  
  //取得QRCode的圖
  showQRCode(qrcode: string): void {
    this.qrCodeUrl = qrcode;
    document.getElementById("display")!.innerHTML = "";
    // (document.getElementById("iQRCode") as HTMLImageElement).src = qrcode;
    // document.getElementById("display")!.innerHTML = "";
  }
  
  //告知QRCode已被掃描
  qrcodeIsScan(): void {
    //document.getElementById("iQRCode").src = "";
    // document.getElementById("display")!.innerHTML = "QRCode已被掃描<br>";
    console.log("QRCode已被掃描");
  }
  
  //告知已成功登入，並回傳相關訊息
  loginSuccess(token: string, refreshToken: string, empNo: string, expire: string): void {
    (document.getElementById("iQRCode") as HTMLImageElement)!.src = "";
    // document.getElementById("display")!.innerHTML = "登入成功，登入資訊如下：<br>";
    // document.getElementById("display")!.innerHTML += "Token:" + token + "<br>";
    // document.getElementById("display")!.innerHTML += "RefreshToken:" + refreshToken + "<br>";
    // document.getElementById("display")!.innerHTML += "EmpNo:" + empNo + "<br>";
    // document.getElementById("display")!.innerHTML += "Expire:" + expire + "<br>";

    console.log(this.ad)

    console.log("Token:",token)
    console.log("RefreshToken:",refreshToken)
    console.log("EmpNo:",empNo)
    console.log("Expire:",expire)

    //存入local
    console.log("successLoginData",this.successLoginData)
    this.HttpApiService.saveUser(this.successLoginData)
    //跳轉至首頁
    // this.router.navigateByUrl(`/main`);
    // this.router.navigate(['/main']);

    this.router.navigate(['/main']).then(() => {
      Swal.fire({
        icon: 'success',
        title: "登入成功！",
        showConfirmButton: false,
        timer: 1500
      }).then(() =>{
        // 重新載入页面
        location.reload()
      })
    });
    // if(this.ad == empNo){
    //   document.getElementById("display")!.innerHTML = "輸入AD與掃描者身份一致" + "<br>";
    //   console.log("輸入AD與掃描者身份一致");
    // }else{
    //   document.getElementById("display")!.innerHTML = "輸入AD與掃描者身份不一致" + "<br>";
    //   console.log("輸入AD與掃描者身份不一致")
    // }
  }
  
  //告知發生了甚麼錯誤
  error(message: string): void {
    (document.getElementById("iQRCode")as HTMLImageElement).src = "";
    document.getElementById("display")!.innerHTML = message + "<br>";
  }
  


}
