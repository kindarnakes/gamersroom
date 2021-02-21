import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  private nperpage;
  private page;
  public friends: User[];
  public isremovable;
  constructor(private userService: UserService, private utils:UtilsService, private auth:AuthService, private router:Router) {
    this.page = 1;
    this.nperpage = 6;
    this.friends = [];
    this.isremovable = true;
   }

  async ngOnInit() {
  }

  async ionViewDidEnter(){
    await this.utils.presentLoading();
    await this.load();
    await this.utils.stopLoading();
  }

  async doRefresh($event){
    this.page = 1;
    this.friends = [];
    await this.load();
    if ($event) {
      $event.target.complete();
    }

  }

  async loadData($event){
    await this.load();

    if ($event) {
      $event.target.complete();
    }

  }

  load(){
    this.isremovable = true;
    this.userService.getFriends(this.auth.user.id, this.page, this.nperpage).then(async r =>{
      
      if(r.data){
        let friends = await JSON.parse(r.data);
        console.log(friends);
        for(let p of friends){
          this.friends.push(p);
        }
        this.page +=1;
      }

    }).catch(err =>{

    });

  }

  toProfile(user:User){
    this.userService.profile = user;
    this.router.navigate(['profile/' + user.id])

  }

  remove(id:number){
    console.log(id);
    this.userService.removeFriend(this.auth.user.id, id).then(r=>{
      let newFriends = [];
      let newIdFriends = [];
      for(let f of this.friends){
        
        if(f.id != id){
          newFriends.push(f.id);
          newFriends.push(f);
        }
      }
      this.auth.friends = newFriends;
      this.friends = newFriends;
      
    }).catch(err =>{

    });
    
  }

  async onInput($event){
    if($event.length > 3){
      this.isremovable = false;
      this.friends = [];
      await this.utils.presentLoading();
      this.userService.getUserByName($event).then(async r =>{
      
        if(r.data){
          let friends = await JSON.parse(r.data);
          console.log(friends);
          for(let p of friends){
            this.friends.push(p);
          }
        }
        await this.utils.stopLoading();
  
      }).catch(async err =>{
        console.log(err);
        await this.utils.stopLoading();
      });
    }
    

  }

  async onCancel($event){
    await this.utils.presentLoading();
    await this.load();
    await this.utils.stopLoading();
    
  }

}
