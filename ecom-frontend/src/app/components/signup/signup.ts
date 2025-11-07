import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  message: string = '';
  isError: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      contact: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.message = 'Please fill all fields correctly.';
      this.isError = true;
      return;
    }

    this.http.post('http://localhost:3000/api/auth/signup', this.signupForm.value).subscribe({
      next: (res: any) => {
        this.message = res.message;
        this.isError = false;
        this.signupForm.reset();
      },
      error: (err) => {
        this.message = err.error.message || 'Something went wrong';
        this.isError = true;
      },
    });
  }
}
