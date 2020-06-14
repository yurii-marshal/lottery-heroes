import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-real-time-notifications',
  templateUrl: './real-time-notifications.component.html',
  styleUrls: ['./real-time-notifications.component.scss']
})
export class RealTimeNotificationsComponent implements OnInit {
  @Output() oSubmitEvent = new EventEmitter<string>();
  notificationsForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.notificationsForm = this.formBuilder.group({
      mobile: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.notificationsForm.controls['mobile'].markAsTouched();
    if (this.notificationsForm.valid) {
      this.oSubmitEvent.emit(this.notificationsForm.value.mobile);
    }
  }
}
