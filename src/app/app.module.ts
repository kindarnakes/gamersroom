import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';


import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslationService } from './services/translation.service';
import { HTTP } from '@ionic-native/http/ngx';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { UtilsService } from './services/utils.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { CameraService } from './services/camera.service';
import { Camera } from '@ionic-native/camera/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { PublicationService } from './services/publication.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeolocationService } from './services/geolocation.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';
import { Sensors } from '@ionic-native/sensors/ngx';
import { LightService } from './services/light.service';


export function setTranslateLoader(http: any) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (setTranslateLoader),
        deps: [HttpClient]
      }
    }), 
    FormsModule, 
    ReactiveFormsModule

  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    TranslationService,
    AuthService,
    HTTP,
    UserService,
    UtilsService,
    GooglePlus,
    CameraService,
    Camera,
    Base64,
    PublicationService,
    NativeStorage,
    GeolocationService,
    Geolocation,
    FirebaseMessaging,
    Sensors,
    LightService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
