import { Component , NgZone , ViewChild} from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-add-articletextarea[autoresize]',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent {
  constructor(private _ngZone: NgZone){}
  
  // @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  // triggerResize() {
  //   // Wait for changes to be applied, then trigger textarea resize.
  //   this._ngZone.onStable.pipe(take(1))
  //       .subscribe(() => this.autosize.resizeToFitContent(true));
  // }

  name = 'Angular 6';
  htmlContent = '';

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Enter text in this rich text editor....',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: 'Quote',
        class: 'quoteClass',
      },
      {
        name: 'Title Heading',
        class: 'titleHead',
        tag: 'h1',
      },
    ],
  };

  
}
