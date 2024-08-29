import { Component, Input } from '@angular/core';
import { COLORS, SIZES } from '../../styles';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() backgroundColor: string = COLORS.SECONDARY;
  @Input() width: string = SIZES.CARD_WIDTH;
  @Input() height: string = SIZES.CARD_HEIGHT;
  @Input() name: string = '';
  @Input() icon: string = '';
}
