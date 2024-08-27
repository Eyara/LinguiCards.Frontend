import { Component, Input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { SIZES } from '../../styles';

@Component({
  selector: 'card',
  standalone: true,
  imports: [MatCard, MatCardContent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() width: string = SIZES.CARD_WIDTH;
  @Input() height: string = SIZES.CARD_HEIGHT;
  @Input() imgSrc: string = '';
  @Input() name: string = '';
}
