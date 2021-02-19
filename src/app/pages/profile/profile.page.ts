import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public image;
  public selected;
  public segment; //true profile, false post
  private posts = [];

  constructor(public userService:UserService) {
    this.selected = "profile";
    this.segment = true;
   }

  ngOnInit() {
  }

  ionViewDidEnter(){
    if(this.userService.profile.portrait){
      this.image = this.userService.profile.portrait;
    }else{
      this.image = "";
    }
  }

  edit(){

  }

  segmentChanged($event){
    this.segment = !this.segment;
    if(!this.segment && this.posts.length == 0 ){
      this.loadpost();
    }
  }

  loadpost(){
    console.log("post");
    for(let i = 0; i<5; i++){
      this.posts.push({text:i});
    }
  }

}
