import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private endpoint = "/user";

  constructor(private http: HTTP) { }

  signUp(user:User){
    this.http.setDataSerializer('json');
    return this.http.post(this.endpoint, {...user}, this.header);
  }
  
  signIn(user:User){
    this.http.setDataSerializer('json');
    return this.http.post(this.endpoint+'/login', {...user}, this.header);
  }


  private get header(): any {
    return {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    };
  }
}
