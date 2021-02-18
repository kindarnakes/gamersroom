import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  public language: string;
  public languages = ['es', 'en'];


  constructor(
    private translate: TranslateService) {
  }


  public init():void{

    this.translate.addLangs(this.languages);
    this.translate.setDefaultLang('en');
    this.language = 'en';

    if (this.translate.getBrowserLang) {  //if browsers's language is avalaible is set up as default
      if (this.languages.includes(this.translate.getBrowserLang())) {
        this.translate.use(this.translate.getBrowserLang());
        this.language = this.translate.getBrowserLang();
      }
    }

  }



}




