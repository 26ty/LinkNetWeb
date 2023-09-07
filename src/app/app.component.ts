import { Component , OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpApiService } from './api/http-api.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

const USER_KEY = 'auth-user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'LinkNetWeb';

  constructor(
    private router: Router,
    private HttpApiService: HttpApiService,
  ){

  }
  userData: any = ""
  ngOnInit():void{
    // location.reload()
    // 清空 localStorage
    // localStorage.clear();

    const userLocalData = window.localStorage.getItem(USER_KEY)
    this.userData = JSON.parse(String(userLocalData))

    console.log(this.userData)

  }

  homeLink() {
    window.location.assign('/main');
  }

  privyLink() {
    window.location.assign('/privy');
  }

  addArticleLink() {
    window.location.assign('/addArticle');
  }

  collectionLink() {
    window.location.assign('/collection');
  }

  /**
    * 登出函式
  */
  logout(){
    Swal.fire({
      title: '您是否確定要登出?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '確認!',
      cancelButtonText: '取消!',
      confirmButtonColor: '#1972D6',
      cancelButtonColor: '#d33',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        //進行local資訊清空及登出
        this.HttpApiService.logout()
        this.userData=""
        Swal.fire(
          {
            icon: 'success',
            title: '登出成功!',
            showConfirmButton: false,
            timer: 1500
          }
        )

      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          {
            icon: 'error',
            title: '取消登出!',
            showConfirmButton: false,
            timer: 1500
          }
        )
      }
    })
  }
}
