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

  
  ngOnInit():void{
    this.getAllArticle()
  }


  articleDatas:any;
  /**
    * 取得所有文章data
    *
    * @return {obj} article datas 
  */
  getAllArticle() {
    this.HttpApiService.getArticleRequest().subscribe(
      res => {
        this.articleDatas = res
        console.log(this.articleDatas)
      }
    )
  }
  
  detailArticle(id:string) {
    window.location.assign('/detailArticle/' + id);
  }
}
