import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { publication } from 'src/app/model/publication';
import { AuthService } from 'src/app/services/auth.service';
import { PublicationService } from 'src/app/services/publication.service';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CommentsPage } from '../comments/comments.page';
import { ConfirmPage } from '../confirm/confirm.page';
import { PublicationPage } from '../publication/publication.page';
import * as Leaflet from 'leaflet';
import { icon, Marker } from 'leaflet';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

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

  public posts = [];
  private nperpage;
  private page;

  constructor(private userService: UserService, private utils: UtilsService, private aut: AuthService, private translate: TranslateService, private post: PublicationService,
    private formBuilder: FormBuilder,
    private router: Router) {

    this.nperpage = 6;
    this.page = 1;
  }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    if (!this.utils.loadingController) {
      await this.utils.presentLoading();
    }
    this.loadpost();
    if (this.utils.loadingController) {
      await this.utils.stopLoading();
    }

  }

  editPost(id) {

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

  toComments(publication: publication) {

    console.log(publication);

    this.utils.modal(CommentsPage, { publication: publication }).then(data => {
    });
  }

  async loadpost() {

    await this.post.getAllByUserId(this.aut.user.id, this.page, this.nperpage).then(async data => {
      let publications = await JSON.parse(data.data);
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
    });

  }

  async loadPost($event){
    await this.loadpost();

    if ($event) {
      $event.target.complete();
    }

  }


  async doRefresh($event) {
    this.page = 1;
    this.posts = [];
    await this.loadpost();

    if ($event) {
      $event.target.complete();
    }
  }

  posting() {
    this.utils.modal(PublicationPage, {}).then(data => {
      if(data.data){
        console.log(data.data);
      }
    });
  }

}
