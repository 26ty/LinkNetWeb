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
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

//editor
import { AngularEditorModule } from '@kolkov/angular-editor';

//http
import { HttpClientModule} from '@angular/common/http';

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
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RecommendComponent,
    PrivyComponent,
    AddArticleComponent,
    CollectionComponent,
    EditArticleComponent
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

    
    /* editor */
    AngularEditorModule,

    /* http */
    HttpClientModule,

    FormsModule,


    /* routing */
    PrivyRoutingModule,
    RouterModule.forRoot([
      {path:"",component:HomeComponent},
      {path:"privy",component:PrivyComponent},
      {path:"addArticle",component:AddArticleComponent},
      {path:"collection",component:CollectionComponent},
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
