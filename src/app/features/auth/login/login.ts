import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Sending login request...')
      this.auth.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('Login successful', res);
          this.router.navigate(['/dashboard']).then(success => {
            console.log('Navigation to dashboard was successful:', success);
          });
        },
        error: (err) => console.error('Login failed', err),
      });
    }
  }
}
