import { select } from '@angular-redux/store';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Profile } from '../../models';
import { DataService } from '../../services/data.service';



@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  @select(['profile'])
  readonly profile$: Observable<Profile>;

  @select(['_persist'])
  readonly persist$: Observable<any>;

  profile;
  destroy$ = new Subject<void>();

  constructor(
    private navController: NavController,
    private dataService: DataService,
    private toastCtrl: ToastController,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.profile$
    .pipe(takeUntil(this.destroy$))
    .subscribe(profile => {
      if (profile.googleAuth) {
        this.router.navigateByUrl('tabs');
      }
    });
    if (!window.cordova) {
      this.router.navigateByUrl('tabs');
    }
  }

  async showErrorToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }


  authenticate() {
    this.dataService.initializeGoogleDrive().then(async () => {
      this.router.navigateByUrl('tabs');
    }).catch(e => {
      console.log(e.message);
      this.showErrorToast(e.message);
    });
  }
}
