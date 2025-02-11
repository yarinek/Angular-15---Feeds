import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { InputComponent } from '@app/shared/components/input/input.component';
import { SelectComponent } from '@app/shared/components/select/select.component';

import { authActions } from './../store/actions';
import { RegisterRequest } from '../auth.types';
import { selectIsSubmitting } from '../store/reducers';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputComponent, SelectComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  protected form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    role: ['', Validators.required],
  });

  // example roles - in production this should be fetched from the backend
  roles = [
    { key: 'user', value: 'User' },
    { key: 'admin', value: 'Admin' },
  ];

  data$ = combineLatest({
    isSubmitting$: this.store.select(selectIsSubmitting),
  });

  onSubmit(): void {
    const request: RegisterRequest = {
      user: this.form.getRawValue(),
    };
    // Every HTTP request should be dispatched as an action
    this.store.dispatch(authActions.register({ request }));
  }
}
