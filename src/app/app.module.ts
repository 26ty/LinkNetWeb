import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//material component
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';

//textarea
import { TextFieldModule } from '@angular/cdk/text-field';

//editor
import { AngularEditorModule } from '@kolkov/angular-editor';

//quill
// import { QuillModule } from 'ngx-quill';

//http
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';

//page
import { HomeComponent } from './views/home/home.component';
import { RecommendComponent } from './views/recommend/recommend.component';
import { PrivyComponent } from './views/privy/privy.component';
import { PrivyRoutingModule } from './views/privy/privy-routing.module'

import { RouterModule } from '@angular/router';
import { AddArticleComponent } from './views/add-article/add-article.component';
import { CollectionComponent } from './views/collection/collection.component';
import { EditArticleComponent } from './views/edit-article/edit-article.component';
import { LoginComponent } from './login/login.component';
import { ContainerComponent } from './views/container/container.component';
import { ContainerRoutingModule } from './views/container/container-routing.module';
import { ContainerModule } from './views/container/container.module';
import { DetailArticleComponent } from './views/detail-article/detail-article.component';
import { LoginModule } from './login/login.module';
import { HeaderComponent } from './layout/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RecommendComponent,
    PrivyComponent,
    AddArticleComponent,
    CollectionComponent,
    EditArticleComponent,
    LoginComponent,
    ContainerComponent,
    DetailArticleComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    /*  matrial */
    MatSlideToggleModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatMenuModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatChipsModule,

    /* textarea */
    TextFieldModule,
    /* editor */
    AngularEditorModule,
    /* */
    // QuillModule.forRoot(),
    /* http */
    HttpClientModule,
    FormsModule,


    /* routing */
    PrivyRoutingModule,
    RouterModule.forRoot([
      { path: "main", component: HomeComponent },
      { path: "privy", component: PrivyComponent },
      { path: "addArticle", component: AddArticleComponent },
      { path: "editArticle/:a_id", component: EditArticleComponent },
      { path: "detailArticle/:a_id", component: DetailArticleComponent },
      { path: "collection", component: CollectionComponent },
      {path:'',redirectTo:'/login',pathMatch:'full'},
      {path:'login',component:LoginComponent}
    ]),

    ContainerRoutingModule,
    ContainerModule,
    LoginModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
