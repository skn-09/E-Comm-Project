import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string = '';
  isError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.message = 'Please enter valid credentials.';
      this.isError = true;
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        if (res.token && res.user?.id) {
          this.authService.storeSession(res.token, res.user.id);
        }

        this.message = res.message;
        this.isError = false;
        this.loginForm.reset();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.log('Error:', err);
        console.log('error message:', err.error);

        this.message = err.error.message || 'Login failed';
        this.isError = true;
      },
    });
  }
}
