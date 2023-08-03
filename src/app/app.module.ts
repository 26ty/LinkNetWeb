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

//page
import { HomeComponent } from './views/home/home.component';
import { RecommendComponent } from './views/recommend/recommend.component';
import { PrivyComponent } from './views/privy/privy.component';
import { PrivyRoutingModule } from './views/privy/privy-routing.module'

import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RecommendComponent,
    PrivyComponent
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

    
    PrivyRoutingModule,
    RouterModule.forRoot([
      {path:"privy",component:PrivyComponent},
      {path:"",component:HomeComponent}
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
