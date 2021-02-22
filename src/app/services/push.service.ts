import { Injectable } from '@angular/core';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor(private firePush: FirebaseMessaging) { }

  public async getToken(){
    this.firePush.getToken().then(r =>{
      
    }).catch(err => {
      console.log(err);
      
    });
  }
}
