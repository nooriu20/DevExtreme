import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const RG_VALUES = [
  'Mark',
  'Mary',
  'Lion',
];

@Component({
  selector: 'dx-radio-group-compat-simple',
  template: `
    <div class="example">
      <div class="example__title">
        RadioGroupCompat simple example
      </div>
      <div class="example__control">
        <dx-radio-group-compat
          *ngIf="value$ | async as value"
          [items]="rgValues"
          [value]="value"
          (valueChange)="setValue($event)">
        </dx-radio-group-compat>
      </div>
      <div class="example__info">
        <span>Selected value: </span>
        <span>{{value$ | async}}</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupCompatSimpleExampleComponent {
  private valueSubject = new BehaviorSubject<string | undefined>(RG_VALUES[1]);

  rgValues = RG_VALUES;

  value$ = this.valueSubject.asObservable();

  setValue(value?: string): void {
    this.valueSubject.next(value);
  }
}