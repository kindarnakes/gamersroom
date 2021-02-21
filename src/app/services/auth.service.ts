import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {


  private _user: User;
  public friends:number[];

  constructor(private router: Router,
    private google: GooglePlus,
    private userService: UserService,
    private storage: NativeStorage) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    let login = this.isLoggin();
    if (!login) {
      this.router.navigate(['login']);
    }
    return login;
  }


  isLoggin() {
    return this.user != null;
  }


  async signOut() {
    const options = {
      offline: false
    };
    await this.google.trySilentLogin(options).then(async () => {
      await this.google.logout();
    }).catch(err => {
      console.log(err);

    });
    this.user = null;
    this.save();
    this.router.navigate(['login']);
  }

  async loginGoogle() {
    await this.userService.loginGoogle().then(r => {
      if (r) {
        this.user = r;
      }
    }).catch(err => {
      console.log(err);

    })
  }

  public set user(user: User) {
    this._user = user;
    this.friends = [];
    if(user && user.friends && user.friends.length > 0){
    for(let id of user.friends){
      this.friends.push(id.id);
    }}
    this.save();
  }

  public get user() {
    return this._user;
  }

  save() {
    this.storage.setItem('user', this.user)
      .then(
        () => console.log(this.user),
        error => console.error('Error storing item', error)
      );
  }

  load() {

    return this.storage.getItem('user');
  }


}
