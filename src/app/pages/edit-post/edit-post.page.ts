import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Base64 } from '@ionic-native/base64/ngx';
import { ModalController } from '@ionic/angular';
import { publication } from 'src/app/model/publication';
import { AuthService } from 'src/app/services/auth.service';
import { UtilsService } from 'src/app/services/utils.service';
import { GalleryPage } from '../gallery/gallery.page';
import { MapPage } from '../map/map.page';
import * as Leaflet from 'leaflet';
import { icon, Marker } from 'leaflet';
import { PublicationService } from 'src/app/services/publication.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.page.html',
  styleUrls: ['./edit-post.page.scss'],
})
export class EditPostPage implements OnInit {

  @Input('postToEdit') postToEdit: publication;

  private win: any = window;
  public publication: FormGroup;

  public post:publication;

  public map: Leaflet.Map;
  public images = [];

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
  private marker: Marker;
  public showMap;

  constructor(private modalController: ModalController,
    private formBuilder: FormBuilder, private auth:AuthService, private utils:UtilsService,
    private base64: Base64,
    private PublicationService:PublicationService) {
      this.showMap = false;

    this.publication = this.formBuilder.group({
      text: ['', Validators.required]
    });

    this.post = {
      text: '',
      user: this.auth.user,
      images: []
    }

   }

   async ionViewDidEnter(){
     this.post = {...this.postToEdit};
     this.publication.get('text').setValue(this.post.text);
     this.post.images.forEach(img => {
        this.images.push(img.url);
     })
     

     if(this.post.coordinates){
      this.showMap = true;
      setTimeout(async () =>{

     this.map = await Leaflet.map('mapEdit'+this.post.id).setView([this.post.coordinates.latitude, this.post.coordinates.longitude], 200);
     Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       attribution: 'ies Francisco de los Rios',
     }).addTo(this.map);
 
 
     this.marker = Leaflet.marker([this.post.coordinates.latitude, this.post.coordinates.longitude], {icon: this.iconDefault})
     this.marker.addTo(this.map);
   }, 200);}}

  ngOnInit() {

    this.post = {
      text: '',
      user: this.auth.user,
      images:[]
    }
  }

  back(){
    this.modalController.dismiss();
  }

  textChange(){
    this.post.text =  this.publication.get('text').value;
  }

  async sendForm(){
    await this.utils.presentLoading()
    this.PublicationService.updatePublication(this.post).then(async r => {
      await this.utils.stopLoading();
      await this.modalController.dismiss( await JSON.parse(r.data));
    }).catch(async err =>{
      console.log(err);
      await this.utils.stopLoading();
      
    })
    

  }

  addImage(){
      this.utils.modal(GalleryPage, {}).then(async image => {
        if(image.data){
        await this.utils.presentLoading();
        let img = image.data;
        if (img.startsWith('file') || img.startsWith('/') ) {
          this.images.push(
            this.win.Ionic.WebView.convertFileSrc(img));
          await this.base64.encodeFile(image.data).then(
            (base64: any) => {
              img = base64.substr(13, base64.length);
              this.post.images.push({url: 'data:image/jpeg;base64' + img});
              this.utils.stopLoading();
            });
        } else {
          this.post.images.push({url : 'data:image/jpeg;base64,' + img});
          this.images.push('data:image/jpeg;base64,' + img);
          this.utils.stopLoading();
        }}
      })
    }


  addCoordinates(){
    this.utils.modal(MapPage, {}).then(async coords =>{
      this.showMap = true;

      if(coords.data){
        setTimeout(async () =>{

          if(this.map){
            this.map.remove()
          }
        this.map = await Leaflet.map('mapEdit'+this.post.id).setView([coords.data.lat, coords.data.lng], 200);
        Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'ies Francisco de los Rios',
        }).addTo(this.map);
    
    
        this.marker = Leaflet.marker([coords.data.lat, coords.data.lng], this.iconDefault)
        this.marker.addTo(this.map);
        this.post.coordinates = {
          latitude: coords.data.lat, 
          longitude: coords.data.lng
        }

        }, 200);
    }else{
      this.map.remove();
      this.showMap = false;
      this.post.coordinates = null;
      console.log('destroy');
    }
      
    }).catch(err =>{
      console.log(err);
      
    })

  }

  addVideo(){
  }

  deleteImg(index){
    let imgs = []
    let imgTemp = []
    this.post.images.forEach((img, i) => {
        if(index != i){
          imgs.push(img);
          imgTemp.push(this.images[i]);
        }
    });
    this.images = imgTemp;
    this.post.images = imgs;
  }
  
  

}