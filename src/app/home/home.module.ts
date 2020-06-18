import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage, ModalComponent } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    NzCardModule,
    NzButtonModule,
  ],
  declarations: [HomePage, ModalComponent ]
})
export class HomePageModule {}
