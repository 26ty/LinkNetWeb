import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LinkNetWeb';

  homeLink() {
    window.location.assign('/');
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
}
