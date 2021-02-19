import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {


  private _user: User;

  constructor(private router: Router,
    private google: GooglePlus,
    private userService:UserService) { }


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
  
  
  async signOut(){
    const options = {
      offline: false
    };
    await this.google.trySilentLogin(options);
    await this.google.logout();
    this.user = null;
    this.router.navigate(['login']);
  }

  async loginGoogle(){
    await this.userService.loginGoogle().then(r =>{
      if(r){
        this.user = r;
      }
    }).catch(err => {
      console.log(err);
      
    })
  }

  public set user(user:User){
    this._user = user;
  }

  public get user(){
    return this._user;
  }


}
