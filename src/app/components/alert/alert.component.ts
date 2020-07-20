import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  errorMsg;
  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {
    this.errorMsg = navParams.get('errorMsg');
  }

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
