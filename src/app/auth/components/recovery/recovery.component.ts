import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User, RecoveryQuestion } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent implements OnInit {
  recoveryForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  currentStep: number = 1;
  recoveryQuestions: RecoveryQuestion[] = [];
  selectedQuestion: string = '';
  showPasswordFields: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      questionId: ['', [Validators.required]],
      answer: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.recoveryQuestions = this.userService.getRecoveryQuestions();
    
    this.recoveryForm.get('email')?.valueChanges.subscribe(email => {
      if (email && this.recoveryForm.get('email')?.valid) {
        this.userService.getUserByEmail(email).subscribe(user => {
          if (user) {
            this.currentStep = 2;
            this.errorMessage = '';
          } else {
            this.errorMessage = 'No account found with this email';
          }
        });
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  onQuestionSelect(): void {
    const questionId = this.recoveryForm.get('questionId')?.value;
    const selectedQuestion = this.recoveryQuestions.find(q => q.id === questionId);
    if (selectedQuestion) {
      this.selectedQuestion = selectedQuestion.question;
    }
  }

  async verifyAnswer(): Promise<void> {
    if (this.recoveryForm.get('answer')?.valid) {
      const { email, answer } = this.recoveryForm.value;
      
      try {
        const verificationResult = await this.userService.verifyRecoveryAnswer(email, answer);
        verificationResult.subscribe({
          next: (isValid) => {
            if (isValid) {
              this.currentStep = 3;
              this.showPasswordFields = true;
              this.errorMessage = '';
            } else {
              this.errorMessage = 'Incorrect answer to security question';
            }
          },
          error: () => {
            this.errorMessage = 'An error occurred. Please try again.';
          }
        });
      } catch (error) {
        this.errorMessage = 'An error occurred. Please try again.';
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (this.recoveryForm.valid) {
      const { email, newPassword } = this.recoveryForm.value;
      
      try {
        const userResult = await this.userService.getUserByEmail(email);
        userResult.subscribe({
          next: async (user) => {
            if (user) {
              const updatedUser = { ...user, password: newPassword };
              const updateResult = await this.userService.updateUser(updatedUser);
              updateResult.subscribe({
                next: () => {
                  this.successMessage = 'Password updated successfully! Redirecting to login...';
                  setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                  }, 2000);
                },
                error: () => {
                  this.errorMessage = 'Failed to update password. Please try again.';
                }
              });
            }
          }
        });
      } catch (error) {
        this.errorMessage = 'An error occurred. Please try again.';
      }
    }
  }
} 