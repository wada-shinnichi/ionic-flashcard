import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CardService } from 'src/app/services/card.service';

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
