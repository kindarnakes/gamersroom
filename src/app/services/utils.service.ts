import { Injectable } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private loading;
  

  constructor(public loadingController: LoadingController,
    public toastController: ToastController,
    private modalController: ModalController) { }

  public async presentLoading():Promise<void> {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: '',
      spinner: 'crescent'
    });
    return this.loading.present();
  }

  public stopLoading():Promise<void>{
    return this.loading.dismiss();
  }

  async presentToast(msg: string, col: string) {
    const toast = await this.toastController.create({
      message: msg,
      color: col,
      duration: 5000,
      position: "top"
    });
    
    toast.present();
  }

  public async modal(component:any, componentProps:any) {
    const modal = await this.modalController.create({
      component: component,
      cssClass: 'my-custom-class',
      componentProps: {
        ...componentProps
      }
    });

    await modal.present();

    return await modal.onDidDismiss();
  }


}
