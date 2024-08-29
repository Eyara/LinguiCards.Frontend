import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { SIZES } from '../../styles';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CountryModel } from '../../models/country.model';
import { MatIcon } from '@angular/material/icon';
import { LanguageModel } from '../../models/language.model';

@Component({
  selector: 'card',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCard, MatCardContent, MatFormField, MatIcon, MatInput, MatOption, MatSelect],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

// TODO: make this component more generic
export class CardComponent {
  @Input() width: string = SIZES.CARD_WIDTH;
  @Input() height: string = SIZES.CARD_HEIGHT;
  @Input() imgSrc: string = '';
  @Input() name: string = '';
  @Input() editMode: boolean = false;
  @Input() countries: CountryModel[] = [];
  @Output() saveEmit: EventEmitter<LanguageModel> = new EventEmitter<LanguageModel>();
  selectedItem: CountryModel = {} as CountryModel;

  saveItem() {
    this.saveEmit.emit({
      name: this.selectedItem.name,
      imgSrc: this.selectedItem.flagSrc
    } as LanguageModel);
  }
}
