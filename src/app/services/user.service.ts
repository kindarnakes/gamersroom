import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private endpoint = "/user";
  private _profile: User;

  constructor(private http: HTTP,
    private google: GooglePlus) { }

  signUp(user: User) {
    this.http.setDataSerializer('json');
    return this.http.post(this.endpoint, { ...user }, this.header);
  }

  getUserByEmail(user: User) {
    return this.http.get(this.endpoint + '/email/' + user.email, {}, this.header)
  }

  getUserByName(name: string) {
    return this.http.get(this.endpoint + '/name/' + name, {}, this.header)
  }

  getUser(id: number) {
    return this.http.get(this.endpoint + '/' + id, {}, this.header)
  }

  getFriends(id: number, page:number, nperpage:number) {
    return this.http.get(this.endpoint + '/friends/' + id + '/' + page + '/' + nperpage, {}, this.header)
  }

  getPetitions(id: number, page:number, nperpage:number) {
    return this.http.get(this.endpoint + '/petitions/' + id + '/' + page + '/' + nperpage, {}, this.header)
  }

  updateUser(user: User) {
    this.http.setDataSerializer('json');
    return this.http.put(this.endpoint + "/" + user.id, { ...user }, this.header);
  }

  removeFriend(iduser:number, idfriend:number){
    return this.http.delete(this.endpoint+'/friend/'+iduser + '/' + idfriend, {}, this.header);
  }

  addFriend(iduser:number, idfriend:number){
    return this.http.post(this.endpoint+'/friend/'+iduser + '/' + idfriend, {}, this.header);
  }

  signIn(user: User) {
    this.http.setDataSerializer('json');
    return this.http.post(this.endpoint + '/login', { ...user }, this.header);
  }

  public async loginGoogle(): Promise<User> {
    try {
      let u = await this.google.login({})
      if (u) {
        let user: User = {
          username: u['displayName'],
          portrait: u['imageUrl'],
          email: u['email']
        }
        this.http.setDataSerializer('json');
        return this.getUserByEmail(user).then(r => {
          if (r.data) {
            let newUser = JSON.parse(r.data);
            if (newUser.id && newUser.id > 0) {
              return newUser;
            }
          }

          return this.signUp(user).then(r => {
            if (r.data) {
              let newUser = JSON.parse(r.data);
              if (newUser.id && newUser.id > 0) {
                return newUser;
              }
            };
          }).catch(err => {

          });
        });
      }
    } catch (err) {
      console.log(err);
    }
  }


  private get header(): any {
    return {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    };
  }

  public set profile(user: User) {
    this._profile = user;
  }

  public get profile() {
    return this._profile;
  }
}
