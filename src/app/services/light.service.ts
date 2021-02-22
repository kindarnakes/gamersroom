import { Injectable } from '@angular/core';
import { Sensors, TYPE_SENSOR } from '@ionic-native/sensors/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LightService {

  auto_dark: boolean = false;

  constructor(private sensors: Sensors, private sensor: Sensors, private platform: Platform) { }

  public async enableCheckDarkMode() {

    if (this.platform.is("android")) {
      this.sensors.enableSensor(TYPE_SENSOR.LIGHT);
      let interval = setInterval(async () => {
        await this.sensor.getState().then((data) => {
          if (data[0] < 0.5 && !this.auto_dark) {
            document.body.classList.add('dark');
            this.auto_dark = true;
          } else if (data[0] > 1 && this.auto_dark) {
            document.body.classList.remove('dark');
            this.auto_dark = false;
          }
        }).catch(err=>{
          console.log("No light sensor access");
          clearInterval(interval);
        });
      }, 3000);
    }
  }
}