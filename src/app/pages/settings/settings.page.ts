import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TranslationService } from 'src/app/services/translation.service';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public user: FormGroup;
  edit: boolean;

  constructor(public aut: AuthService,
    private formBuilder: FormBuilder, private userService: UserService,
    private utils: UtilsService, public tranS:TranslationService) {
      this.edit = false;

    this.user = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,16}$")]]
    });
  }

  ngOnInit(){

  }

  public toogleMode(){
    document.body.classList.toggle('dark');
}



editOn() {
  this.edit = true;
}

editOff() {
  this.edit = false;
}
 
async sendForm(){
  
  await this.utils.presentLoading();
  this.editOff();

  let pass = CryptoJS.enc.Base64.stringify(CryptoJS.SHA1(this.user.get('password').value));


  this.aut.user.pass = pass;
  this.updateUser();
}

updateUser(){
  this.userService.updateUser(this.aut.user).then(async r => {
    await this.utils.stopLoading();

  }).catch(async err => {
    await this.utils.stopLoading();
    console.log(err);
  });
}

privacyPublic(){
  this.aut.user.privacy = 0;
  this.updateUser();
}
privacyOnlyMe(){
  this.aut.user.privacy = 2;
  this.updateUser();
}

privacyOnlyFriends(){
  this.aut.user.privacy = 1;
  this.updateUser();
}


}
