import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import * as CryptoJS from 'crypto-js';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public user: FormGroup;

  constructor(public aut: AuthService,
    private formBuilder: FormBuilder, private router: Router, private userService: UserService,
    private utils: UtilsService) {

    this.user = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,6}$")]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{6,16}$")]],
      username: ['', [Validators.required, Validators.pattern("^[A-Za-z\\d\\säÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙÑñ]{6,30}$")]]
    });
  }


  ngOnInit() {
  }


  sendForm() {

    this.utils.presentLoading();

    let user: User = {
      username: this.user.get('username').value,
      email: this.user.get('email').value,
      pass: CryptoJS.enc.Base64.stringify(CryptoJS.SHA1(this.user.get('password').value)),
      privacy: 0,
      description: ""
    }

    this.userService.signUp(user).then(r => {
      console.log(r);
      if (r.data) {
        let newUser = JSON.parse(r.data);
        if (newUser.id && newUser.id > 0) {
          user.id = newUser.id;
          this.aut.user = user;
          console.log(this.aut.isLoggin());
          this.router.navigate(['login']);
        }
      }

      this.utils.stopLoading();

    }).catch(err => {
      this.utils.stopLoading();
      console.log(err);
    });


  }
}
