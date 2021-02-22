import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import * as CryptoJS from 'crypto-js';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { FirebaseMessaging } from '@ionic-native/firebase-messaging/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public user: FormGroup;
  public error;
  public errorGoogle;

  constructor(public aut: AuthService,
    private formBuilder: FormBuilder, private router: Router, private userService: UserService,
    private utils: UtilsService,
    private translate: TranslateService, private push: FirebaseMessaging) {

    this.user = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,6}$")]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,16}$")]]
    });

  }


  async ngOnInit() {
    await this.utils.presentLoading();
    this.aut.load()
    .then(
      async data => {
       if(data && data.id){ 
      await this.userService.getUser(data.id).then(async r =>{
        this.autorize(r);
      }).catch(async err =>{
        this.aut.user = data;
        this.userService.profile = this.aut.user;
        this.router.navigate(['discover']);
      });}else{
        await this.utils.stopLoading();
      }
    }
    ).catch(async err =>{
      await this.utils.stopLoading();
      console.log(err);
    });;
    this.translate.get('NO USER').subscribe((res: string) => {
      this.error = res;
    });
    this.translate.get('ERROR GOOGLE').subscribe((res: string) => {
      this.errorGoogle = res;
    });
  }


  async sendForm() {
    await this.utils.presentLoading();


    let user: User = {
      email: this.user.get('email').value,
      pass: CryptoJS.enc.Base64.stringify(CryptoJS.SHA1(this.user.get('password').value))
    }


    this.userService.signIn(user).then(async r => {
      this.autorize(r);

    }).catch(async err => {
      await this.utils.stopLoading();
      await this.utils.presentToast(this.error, "danger");
      console.log(err);
    });
  }

  async logGoogle(){
    await this.utils.presentLoading();

    await this.aut.loginGoogle().then(async r =>{
      if(this.aut.isLoggin()){
        await this.utils.stopLoading();
        this.userService.profile = this.aut.user;
        await this.utils.presentLoading();
        this.router.navigate(['discover']);
      }else{
        await this.utils.stopLoading();
        await this.utils.presentToast(this.errorGoogle, "danger");
      }
    });
    
  }

  async autorize(r:any){
    
    if (r.data) {
      let newUser = JSON.parse(r.data);
      if (newUser.id && newUser.id > 0) {

        this.aut.user = { ...newUser as User };
        await this.utils.stopLoading();
        this.userService.profile = this.aut.user;
        
        await this.utils.presentLoading();
        this.router.navigate(['discover']);
      } else {
        await this.utils.stopLoading();
        await this.utils.presentToast(this.error, "danger");
      }
    } else {
      await this.utils.stopLoading();
      await this.utils.presentToast(this.error, "danger");
    }

  }

}
