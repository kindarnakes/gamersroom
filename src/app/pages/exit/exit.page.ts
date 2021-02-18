import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-exit',
  templateUrl: './exit.page.html',
  styleUrls: ['./exit.page.scss'],
})
export class ExitPage implements OnInit {

  constructor(
    public auth: AuthService) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.auth.signOut();
  }


}
