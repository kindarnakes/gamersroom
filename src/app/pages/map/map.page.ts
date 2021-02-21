import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as Leaflet from 'leaflet';
import { icon, Marker } from 'leaflet';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  public map: Leaflet.Map;

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

  private coords;
  private marker: Marker;


  constructor(private geo: GeolocationService, private modalController: ModalController, private utils:UtilsService) {

    Marker.prototype.options.icon = this.iconDefault;
  }

  ngOnInit() {
    this.coords = {
      latitude: 0,
      longitude: 0
    }
    this.leafletMap();
  }

  async leafletMap() {
    await this.utils.presentLoading()
    await this.geo.getCurrentCoordinates().then(async location => {

      this.coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
    
      this.map = await Leaflet.map('mapId').setView([this.coords.latitude, this.coords.longitude], 200);
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'ies Francisco de los Rios',
      }).addTo(this.map);
  
  
      this.marker = Leaflet.marker([this.coords.latitude, this.coords.longitude], { draggable: 'true' })
      this.marker.addTo(this.map);

      this.map.on('click', (coords) => {
        console.log(coords);
        this.marker.setLatLng(coords.latlng);
      })

      await this.utils.stopLoading();
    }).catch(async err => {
      console.log(err);
      
     await this.utils.stopLoading();
    });
  }

  sendCoordinates() {
    this.modalController.dismiss(this.marker.getLatLng());
  }
  

  back(){
    this.modalController.dismiss();
  }


}
