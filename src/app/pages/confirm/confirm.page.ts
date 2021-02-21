import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage implements OnInit {

  
  constructor(
    private modalController:ModalController) { }

  ngOnInit() {
  }

  public async yes() {
        await this.modalController.dismiss(true);
  }

  public async no(){
    await this.modalController.dismiss(false);
  }


}
