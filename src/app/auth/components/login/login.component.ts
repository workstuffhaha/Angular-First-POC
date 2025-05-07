import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { GoogleAuthService } from '../../../services/google-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private googleAuthService: GoogleAuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.router.navigate(['/dashboard']);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;
      
      try {
        const result = await this.userService.login(email, password);
        result.subscribe({
          next: (response) => {
            if (response.success && response.user) {
              this.userService.setCurrentUser(response.user);
              this.router.navigate(['/dashboard']);
            } else {
              this.errorMessage = 'Invalid email or password';
            }
          },
          error: () => {
            this.errorMessage = 'An error occurred. Please try again.';
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      } catch (error) {
        this.errorMessage = 'An error occurred. Please try again.';
        this.isLoading = false;
      }
    }
  }

  async signInWithGoogle(): Promise<void> {
    try {
      this.isLoading = true;
      this.errorMessage = '';

      const googleUser = await this.googleAuthService.signInWithGoogle();
      const user = await this.googleAuthService.handleGoogleSignIn(googleUser);
      
      this.userService.setCurrentUser(user);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.errorMessage = 'Failed to sign in with Google. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  navigateToRecovery(): void {
    this.router.navigate(['/auth/recovery']);
  }
} 