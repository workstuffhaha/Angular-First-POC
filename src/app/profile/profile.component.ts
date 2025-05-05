import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User, UserRole } from '../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  allUsers: User[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  isEditing: boolean = false;
  editedUser: User | null = null;

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private router: Router // Add this
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser) {
      if (this.currentUser.role === 'admin') {
        this.loadAllUsers();
      } else {
        this.isLoading = false;
      }
    } else {
      this.errorMessage = 'No user logged in';
      this.isLoading = false;
    }
  }

  private loadAllUsers(): void {
    this.http.get<User[]>('/assets/data/db.json').subscribe({
      next: (data: any) => {
        this.allUsers = data.users;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error loading users';
        this.isLoading = false;
      }
    });
  }

  getInitials(user: User): string {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  startEditing(user: User): void {
    this.isEditing = true;
    this.editedUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profilePicture: user.profilePicture,
      isActive: user.isActive,
      recoveryQuestion: user.recoveryQuestion
    };
  }

  saveChanges(): void {
    if (this.editedUser) {
      // Here you would typically make an HTTP request to update the user
      const index = this.allUsers.findIndex(u => u.id === this.editedUser?.id);
      if (index !== -1) {
        this.allUsers[index] = { ...this.editedUser };
      }
      this.isEditing = false;
      this.editedUser = null;
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editedUser = null;
  }

  logout(): void {
    this.userService.logout(); // Clear user data using the service
    this.router.navigate(['/auth/login']); // Navigate to the login page
  }
} 