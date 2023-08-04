import { Component ,OnInit} from '@angular/core';
import { HttpApiService } from 'src/app/api/http-api.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  constructor(
    private HttpApiService:HttpApiService
  ){}

  // ngOnInit(): void {
  //   // 在这里初始化组件
  // }

  articleDatas:any;
  ngOnInit():void{
    this.HttpApiService.getArticleRequest().subscribe(
      res => {
        this.articleDatas = res
        console.log(this.articleDatas)
      }
    )
    console.log("test")
  }

  detailArticle() {
    window.location.assign('/detailArticle');
  }
}
