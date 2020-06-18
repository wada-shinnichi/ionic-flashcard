import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CardService } from '../services/card.service';
import { DateService } from '../services/date.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  allCards;
  dueCards;
  amountOfDueCards;

  index;
  study;
  cardsToDisplay;
  cardToDisplay;
  selectedTags;
  today;
  answer;

  constructor(
    public popoverController: PopoverController,
    private cardService: CardService,
    private dateService: DateService,
    public modalController: ModalController,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.cardService.getCards().subscribe(cards => {
      this.allCards = cards;
      // Finner antall due cards for å vise som badge
      this.today = this.dateService.transformDate(new Date());
      this.getNoOfDueCards();
      this.selectedTags = [];
      this.study = 'due';
      this.selectStudy(this.study);
    });
  }

  getNoOfDueCards() {
    if (this.allCards.length >= 1) {
      this.dueCards = this.allCards.filter(card => card.date <= this.today);
      this.amountOfDueCards = this.dueCards.length;
    }
  }

  async selectStudy(study: string) {
    switch (study) {
      case 'random': {
        this.study = study;
        this.index = 0;
        this.cardsToDisplay = _.shuffle(this.allCards);
        this.cardToDisplay = this.cardsToDisplay[this.index];
        break;
      }
      case 'custom': {
        this.index = 0;

        await this.presentModal();
        this.cardsToDisplay = '';

        console.log(this.selectedTags);

        if (this.selectedTags && this.selectedTags.length > 0) {
          this.study = study;
          this.cardsToDisplay = this.allCards
            .filter(card => (card.tags.some((val) => this.selectedTags.indexOf(val) !== -1)));
          this.cardToDisplay = this.cardsToDisplay[this.index];
        } else {
          this.selectStudy('due');
          this.router.navigate(['/']);
        }
        break;
      }
      default: {
        this.study = 'due';
        this.index = 0;
        this.cardsToDisplay = this.dueCards;
        this.cardToDisplay = this.cardsToDisplay[this.index];
        break;
      }
    }
  }
  toggleAnswer() {
    this.answer = true;
  }

  nextCard() {
    this.answer = false;
    this.index++;
    this.cardToDisplay = this.cardsToDisplay[this.index];
    console.log(this.cardToDisplay);
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class'
    });

    modal.onDidDismiss().then((data) => {
      if (data !== null) {
        this.selectedTags = data.data;
      }
    });

    return await modal.present();
  }



  async showUserPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
    });
    return await popover.present();
  }
}

@Component({
  template: `
  <ion-list lines="none">
    <ion-list-header class="ion-padding-bottom">Morten</ion-list-header>
    <ion-item button><ion-icon slot ="start" name="person-circle-outline"></ion-icon> View profile</ion-item>
    <ion-item (click)="logout()" button><ion-icon color="danger" slot ="start" name="log-out-outline"></ion-icon> Logout</ion-item>
  </ion-list>
  `
})
export class PopoverComponent {
  constructor(
    public router: Router,
    public authService: AuthService,
  ) {}

  logout() {
    this.router.navigate(['/login']);
    this.authService.logout();
  }
}

@Component({
  template: `
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>Select tags</ion-title>
      <ion-buttons slot="end">
        <ion-button (click)="dismissModal()">Close</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content fullscreen>
    <ion-list>
      <ion-item *ngFor="let tag of tags" [ngClass]="{'highlight': tag.selected === true}" (click)="selectTag(tag)">
          <ion-label>
            <p>{{tag.label}}</p>
          </ion-label>
          <ion-icon name="checkmark-outline" slot="end" *ngIf="tag.selected"></ion-icon>
      </ion-item>
    </ion-list>
  </ion-content>
  
  <ion-footer class="ion-padding">
  <button nz-button  nzType="primary" class="ion-margin-right" (click)="dismissModal()">Select</button>
  <button nz-button  nzType="default" (click)="cancelModal()">Cancel</button>

  </ion-footer>

  <style>
    .highlight {
      --ion-item-background: #EEEEEE ;
    }
  </style>

`,

})
export class ModalComponent implements OnInit {
  cards;
  tags = [];
  selectedTags = [];

  constructor(
    public modalController: ModalController,
    private cardService: CardService,
    ) {}
  ngOnInit(): void {

    this.cardService.getCards().subscribe(cards => {
      this.cards = cards;
      if (this.cards) {
        this.cards.forEach(x => x.tags.forEach(element => {
          this.tags.push({ label: element, value: element});
          const uniqueTags = _.uniqBy(this.tags, 'label');
          this.tags = uniqueTags;
        })
        );
      }
    });

  }
  selectTag(tag) {
    tag.selected = !tag.selected;
    if (tag.selected) {
      this.selectedTags.push(tag);
    } else if (!tag.selected && this.selectedTags.indexOf(tag) !== -1) {
      const index = this.selectedTags.indexOf(tag);
      this.selectedTags.splice(index, index);
    }

  }

  async dismissModal() {
    const data = this.selectedTags;
    await this.modalController.dismiss(data);
  }

  cancelModal() {
    this.selectedTags = [];
    this.dismissModal();
  }
}
