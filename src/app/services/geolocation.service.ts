import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private geolocation: Geolocation) { }


  async getCurrentCoordinates():Promise<Geoposition> {
    let options = {
      timeout: 10000,
      enableHighAccuracy: true,
      maximumAge: 3600
    };
    
    return await this.geolocation.getCurrentPosition(options);
  }
}