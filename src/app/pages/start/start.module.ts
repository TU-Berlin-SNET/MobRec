import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { GoogleActivatedGuard } from '../../googleActivatedGuard';
import { StartPage } from './start.page';



const routes: Routes = [
  {
    path: '',
    component: StartPage,
    canActivate: [GoogleActivatedGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StartPage]
})
export class StartPageModule {}
