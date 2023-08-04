import { Component ,OnInit} from '@angular/core';

@Component({
  selector: 'app-privy',
  templateUrl: './privy.component.html',
  styleUrls: ['./privy.component.css']
})
export class PrivyComponent implements OnInit{

  ngOnInit():void{}

  detailArticle() {
    window.location.assign('/detailArticle');
  }
}
