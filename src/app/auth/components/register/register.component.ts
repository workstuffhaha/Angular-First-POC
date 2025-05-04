import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  recoveryQuestions: { id: string; question: string }[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      recoveryQuestion: ['', [Validators.required]],
      recoveryAnswer: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.recoveryQuestions = this.userService.getRecoveryQuestions();
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const userData = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        password: formValue.password,
        role: 'user' as const,
        recoveryQuestion: {
          question: this.recoveryQuestions.find(q => q.id === formValue.recoveryQuestion)?.question || '',
          answer: formValue.recoveryAnswer
        },
        profilePicture: '',
        isActive: true
      };

      try {
        const registrationResult = await this.userService.registerUser(userData);
        registrationResult.subscribe({
          next: (user: User) => {
            this.successMessage = 'Registration successful! Redirecting to login...';
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 2000);
          },
          error: () => {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        });
      } catch (error) {
        this.errorMessage = 'Registration failed. Please try again.';
      }
    }
  }
} 