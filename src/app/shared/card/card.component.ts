import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {SIZES} from '../../styles';
import {MatOption} from '@angular/material/core';
import {MatFormField, MatSelect} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {DictionarExtendedyModel, LanguageCreateModel} from '../../models/language.model';

@Component({
  selector: 'card',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCard, MatCardContent, MatFormField, MatIcon, MatInput, MatOption, MatSelect],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CardComponent {
  @Input() width: string = SIZES.CARD_WIDTH;
  @Input() height: string = SIZES.CARD_HEIGHT;
  @Input() imgSrc: string = '';
  @Input() name: string = '';
  @Input() editMode: boolean = false;
  @Input() dictionaries: DictionarExtendedyModel[] | null = null;
  @Input() backgroundGreen: boolean = false;
  @Input() backgroundRed: boolean = false;
  @Output() saveEmit: EventEmitter<LanguageCreateModel> = new EventEmitter<LanguageCreateModel>();
  selectedItem: DictionarExtendedyModel = {} as DictionarExtendedyModel;

  saveItem() {
    this.saveEmit.emit({
      name: this.selectedItem.name,
      languageDictionaryId: this.selectedItem.id
    } as LanguageCreateModel);
  }
}
