import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user.interface';

interface LoginResult {
  success: boolean;
  user?: User;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      try {
        const loginResult = await this.userService.login(email, password);
        loginResult.subscribe({
          next: (result: LoginResult) => {
            console.log('Login result:', result);
            if (result.success && result.user) {
              // Store user session
              localStorage.setItem('currentUser', JSON.stringify(result.user));
              console.log('User stored in localStorage');
              // Navigate to home
              this.router.navigate(['/home']).then(success => {
                console.log('Navigation success:', success);
                if (!success) {
                  this.errorMessage = 'Failed to navigate to home page';
                }
              });
            } else {
              this.errorMessage = 'Invalid email or password';
            }
          },
          error: (error) => {
            console.error('Login error:', error);
            this.errorMessage = 'An error occurred. Please try again.';
          }
        });
      } catch (error) {
        console.error('Login exception:', error);
        this.errorMessage = 'An error occurred. Please try again.';
      }
    }
  }

  navigateToRecovery(): void {
    this.router.navigate(['/auth/recovery']);
  }
} 