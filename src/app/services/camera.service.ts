import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Injectable({
  providedIn: 'root'
})
export class CameraService {


  private optionsPhoto:CameraOptions = {
    quality: 60,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  private optionsGallery:CameraOptions = {
    quality: 60,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType:  this.camera.PictureSourceType.PHOTOLIBRARY
  }


  constructor(private camera: Camera) { }

  takePhoto():Promise<string>{
    return this.camera.getPicture(this.optionsPhoto); /*.then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
      // Handle error
     });*/
  }

  takeImageFromGallery():Promise<string>{
    return this.camera.getPicture(this.optionsGallery);
  }
}
