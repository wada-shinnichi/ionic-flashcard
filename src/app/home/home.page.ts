import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CardService } from '../services/card.service';
import { DateService } from '../services/date.service';
import * as _ from 'lodash';
import { PopoverComponent } from './popover/popover.component';
import { ModalComponent } from './modal/modal.component';
import { ICard } from '../shared/card';

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

  modal;
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
      // Antall valgte tags for custom-study
      this.selectedTags = [];
      this.study = 'due';
      this.selectStudy(this.study);
    });
  }

  getNoOfDueCards() {
    if (this.allCards.length >= 1) {
      this.dueCards = this.allCards.filter((card: ICard) => card.date <= this.today);
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
        await this.presentModal();

        this.index = 0;
        this.cardsToDisplay = '';
        await this.modal.onDidDismiss().then((data) => {
          if (data !== null) {
            this.study = study;
            this.selectedTags = [];

            data.data.label.array.forEach(element => {
              this.selectedTags.push(element);
            });

            console.log(this.selectedTags);
            this.cardsToDisplay = this.allCards
              .filter(card => (card.tags.some((val) => this.selectedTags.indexOf(val) !== -1)));
            this.cardToDisplay = this.cardsToDisplay[this.index];
          } else {
            this.selectedTags = [];
            this.router.navigate(['/']);
            this.selectStudy('due');
          }
        });
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
    this.modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class'
    });

    return await this.modal.present();
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
