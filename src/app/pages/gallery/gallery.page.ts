import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CameraService } from 'src/app/services/camera.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {

  
  constructor(
    private modalController:ModalController, private camera: CameraService) { }

  ngOnInit() {
  }

  public async cameraOn() {
    this.camera.takePhoto().then(async r =>{
      await this.modalController.dismiss(r);
    })

        
  }

  public async gallery(){
    this.camera.takeImageFromGallery().then(async r =>{
      await this.modalController.dismiss(r);
    });
  }

  
  back(){
    this.modalController.dismiss();
  }

  

}
