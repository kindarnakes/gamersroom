import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Base64 } from '@ionic-native/base64/ngx';
import { TranslateService } from '@ngx-translate/core';
import { publication } from 'src/app/model/publication';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { CameraService } from 'src/app/services/camera.service';
import { PublicationService } from 'src/app/services/publication.service';
import { TranslationService } from 'src/app/services/translation.service';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CommentsPage } from '../comments/comments.page';
import { ConfirmPage } from '../confirm/confirm.page';
import { FriendsPage } from '../friends/friends.page';
import { GalleryPage } from '../gallery/gallery.page';
import * as Leaflet from 'leaflet';
import { icon, Marker } from 'leaflet';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  iconRetinaUrl = 'assets/marker-icon-2x.png';
  iconUrl = 'assets/marker-icon.png';
  shadowUrl = 'assets/marker-shadow.png';
  iconDefault = icon({
    iconRetinaUrl: this.iconRetinaUrl,
    iconUrl: this.iconUrl,
    shadowUrl: this.shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
  });

  public user: FormGroup;
  public image;
  public selected;
  public segment;
  private posts = [];
  private error;
  public edit;
  public petition = [];
  private nperpage;
  private page;
  private loading;

  constructor(public userService: UserService, private camera: CameraService, private utils: UtilsService, private aut: AuthService, private translate: TranslateService,
    private base64: Base64, private post: PublicationService,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.selected = "profile";
    this.segment = "profile";
    this.edit = false;
    this.nperpage = 6;
    this.page = 1;
    this.loading = true;

    this.user = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern("^[A-Za-z\\d\\säÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚÂÊÎÔÛâêîôûàèìòùÀÈÌÒÙÑñ]{6,30}$")]],
      description: ['']
    })
  }

  ngOnInit() {
    this.translate.get('PHOTO ERROR').subscribe((res: string) => {
      this.error = res;
    });
  }

  ionViewDidEnter() {
    this.loading = true;
    this.user.get('username').setValue(this.userService.profile.username);
    this.user.get('description').setValue(this.userService.profile.description);
    if (this.userService.profile.portrait) {
      this.image = this.userService.profile.portrait;
    } else {
      this.image = "assets/icon/favicon.png";
    }
    if (this.utils.loadingController) {
      this.utils.stopLoading()
    }
    this.posts = [];
  }

  editOn() {
    this.edit = true;
  }

  editOff() {
    this.edit = false;
  }



  async segmentChanged($event) {
    this.segment = $event.detail.value;
    if (this.segment == 'post') {
      this.edit = false;
      this.page = 1;
      this.posts = [];
      await this.utils.presentLoading();
      this.loadpost();
      await this.utils.stopLoading();
    }
    if (this.segment == 'petitions' && this.petition.length == 0) {
      this.edit = false;
      this.page = 1;
      await this.utils.presentLoading();
      await this.loadpetitions();
      await this.utils.stopLoading();
    }
  }

  async loadpetitions() {
    await this.userService.getPetitions(this.aut.user.id, this.page, this.nperpage).then(async r => {

      if (r.data) {
        let petitions = await JSON.parse(r.data);
        for (let p of petitions) {
          this.petition.push(p);
        }
        this.page += 1;
      }
    }).catch(err => {

    })
  }

  async loadpost() {
    if (this.loading) {
      await this.utils.presentLoading();
    }

    await this.post.getByUserId(this.aut.user.id, this.userService.profile.id, this.page, this.nperpage).then(async data => {
      let publications = JSON.parse(data.data);
      if (data.data && data.data != -1) {
        for (let p of publications) {
          this.posts.push(p);
          setTimeout(async () => {
            console.log(p.coordinates);
            
            if (p.coordinates) {
              let map = await Leaflet.map('map' + p.id).setView([p.coordinates.latitude, p.coordinates.longitude], 200);
              Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'ies Francisco de los Rios',
              }).addTo(map);
              let marker: Marker = Leaflet.marker([p.coordinates.latitude, p.coordinates.longitude], {icon: this.iconDefault});
              marker.addTo(map);
            }
          }, 100)
        }
        this.page += 1;
      }
      if (this.utils.loadingController) {
        await this.utils.stopLoading()
      }
    });

    this.loading = false;

  }

  async changeAvatar() {
    this.utils.modal(GalleryPage, {}).then(async image => {
      await this.utils.presentLoading();
      let img = image.data;
      if (img.startsWith('file')) {
        await this.base64.encodeFile(image.data).then(
          (base64: any) => {
            img = base64.substr(13, base64.length);
            console.log(img);
            let user = this.userService.profile;
            user.portrait = 'data:image/jpeg;base64' + img;
            this.userService.profile = user;
          });
      } else {
        let base64Image = 'data:image/jpeg;base64,' + img;

        this.userService.profile.portrait = base64Image;
      }

      this.userService.updateUser(this.userService.profile).then(async r => {
        console.log(r.data);
        if (r.data) {
          let newUser = JSON.parse(r.data);
          if (newUser.id && newUser.id > 0) {

            this.aut.user = { ...newUser as User };
            await this.utils.stopLoading();

          } else {

            await this.utils.stopLoading();
            await this.utils.presentToast(this.error, "danger");
          }
        } else {
          await this.utils.stopLoading();
          await this.utils.presentToast(this.error, "danger");
        }

        this.userService.profile = this.aut.user;
        this.image = this.aut.user.portrait;

      }).catch(async err => {
        await this.utils.stopLoading();
        await this.utils.presentToast(this.error, "danger");
        console.log(err);
      });

    })
  }

  async editUser() {
    await this.utils.presentLoading();
    this.editOff();

    let user: User = {
      username: this.user.get('username').value,
      description: this.user.get('description').value
    }


    this.userService.profile.description = user.description;
    this.userService.profile.username = user.username;


    this.userService.updateUser(this.userService.profile).then(async r => {
      console.log(r);
      if (r.data) {
        let newUser = JSON.parse(r.data);
        if (newUser.id && newUser.id > 0) {
          user.id = newUser.id;
          this.aut.user = user;
        }
      }
      await this.utils.stopLoading();

    }).catch(async err => {
      await this.utils.stopLoading();
      console.log(err);
    });

  }

  async doRefresh($event) {
    this.page = 1;
    this.posts = [];
    await this.loadpost();

    if ($event) {
      $event.target.complete();
    }
  }

  addFriend() {
    this.userService.addFriend(this.aut.user.id, this.userService.profile.id).then(r => {
      if (r.data) {
        let petition = JSON.parse(r.data);
        console.log(petition);

        if (petition) {


          this.aut.friends.push(this.userService.profile.id);
          console.log(this.userService.profile);

          console.log(this.aut.friends);
          console.log(this.aut.friends.includes(this.userService.profile.id));

        }
      }
    }).catch(err => {
      console.log(err);
    })
  }


  toProfile(user: User) {
    this.userService.profile = user;
    this.router.navigate(['profile/' + user.id])

  }


  async doRefreshPetitions($event) {
    this.page = 1;
    this.petition = [];
    await this.loadpetitions();
    if ($event) {
      $event.target.complete();
    }

  }

  async loadDataPetitions($event) {
    await this.loadpetitions();

    if ($event) {
      $event.target.complete();
    }

  }

  remove(id: number) {
    this.userService.removeFriend(id, this.aut.user.id).then(r => {
      let newFriends = [];
      for (let f of this.petition) {
        if (f.id != id) {
          newFriends.push(f);
        }
      }
      this.petition = newFriends;

    }).catch(err => {

    });
  }


  delete(id) {
    this.utils.modal(ConfirmPage, {})
      .then((clear) => {
        if (clear.data == true) {
          this.post.deletePublication(id).then(r => {
            if (r.data) {

              let delId = r.data;
              if (delId) {
                let newpost = []
                for (let p of this.posts) {
                  if (p.id != id) {
                    newpost.push(p);
                  }
                }
                this.posts = newpost;
              }

            }
          })
        }
      });
  }
  editPost(id) {
    console.log('edit ' + id);
  }
  toComments(publication:publication) {

    console.log(publication);
    
    this.utils.modal(CommentsPage, { publication: publication }).then(data => {
    });
  }

  async loadData(event) {
    await this.loadpost();

    if (event) {
      event.target.complete();
    }


  }

}
