import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { TranslationService } from './services/translation.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserService } from './services/user.service';
import { LightService } from './services/light.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public profile;
  public appPages = [
    { title: 'PROFILE', url: '/profile', icon: 'person' },
    { title: 'FRIENDS', url: '/friends', icon: 'people' },
    { title: 'DISCOVER', url: '/discover', icon: 'globe' },
    { title: 'SETTINGS', url: '/settings', icon: 'settings' },
    { title: 'SIGN OUT', url: '/exit', icon: 'log-out' },
  ];
  public noLogappPages = [
    { title: 'SIGN IN', url: '/login', icon: 'log-in' },
    { title: 'SIGN UP', url: '/signup', icon: 'duplicate' }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private tranS: TranslationService,
    public auth: AuthService,
    public userService: UserService,
    public lightService:LightService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      


      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.lightService.enableCheckDarkMode();


      this.translate.addLangs(this.tranS.languages);  //add all languages
      this.translate.setDefaultLang('en'); //use default language
      this.tranS.language = 'en';
      if (this.translate.getBrowserLang) {  //if browsers's language is avalaible is set up as default
        if (this.tranS.languages.includes(this.translate.getBrowserLang())) {
          this.translate.use(this.translate.getBrowserLang());
          this.tranS.language = this.translate.getBrowserLang();
        }
      }
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
      this.translate.get('PROFILE').subscribe((res: string) => {
        this.profile = res;
      });
      
    }
  }

  signOut(){
    this.auth.signOut();
  }
  setMyProfile(){
    this.userService.profile = this.auth.user;    
  }
}
