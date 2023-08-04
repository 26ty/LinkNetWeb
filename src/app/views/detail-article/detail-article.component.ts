import { Component ,OnInit} from '@angular/core';
import { HttpApiService } from 'src/app/api/http-api.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-detail-article',
  templateUrl: './detail-article.component.html',
  styleUrls: ['./detail-article.component.css']
})
export class DetailArticleComponent implements OnInit{

  constructor(
    private HttpApiService:HttpApiService,
    private route: ActivatedRoute,
  ){}

  a_id:any
  ngOnInit():void{
    this.a_id = this.route.snapshot.paramMap.get('a_id')
    console.log(this.a_id)

    this.getOneArticle(this.a_id)
  }

  OneArticleDatas:any;
  /**
    * 取得所有文章data
    *
    * @return {obj} article datas 
  */
  getOneArticle(a_id:string) {
    this.HttpApiService.getOneArticleRequest(a_id).subscribe(
      res => {
        this.OneArticleDatas = res
        console.log(this.OneArticleDatas)
      }
    )
  }

  goBack() {
    window.history.back();
  }

  
}
