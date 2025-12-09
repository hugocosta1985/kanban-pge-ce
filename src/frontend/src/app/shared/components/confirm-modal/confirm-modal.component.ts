import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [DialogModule, ButtonModule], // CommonModule removido
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent {
  visible = model.required<boolean>();

  title = input('Confirmação');
  message = input('Tem certeza que deseja prosseguir?');

  onConfirm = output<void>();

  closeModal() {
    this.visible.set(false);
  }

  handleConfirm() {
    this.onConfirm.emit();
    this.closeModal();
  }
}
