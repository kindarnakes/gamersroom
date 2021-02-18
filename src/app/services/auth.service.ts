import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {


  public user: User;

  constructor(private router: Router) { }
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
  
  
  signOut(){
    this.user = null;
    this.router.navigate(['login']);
  }


}
