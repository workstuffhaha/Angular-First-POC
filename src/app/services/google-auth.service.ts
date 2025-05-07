import { Injectable } from '@angular/core';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private googleUser = new BehaviorSubject<SocialUser | null>(null);
  private isGoogleUser = new BehaviorSubject<boolean>(false);

  constructor(
    private socialAuthService: SocialAuthService,
    private userService: UserService
  ) {
    // Subscribe to Google auth state changes
    this.socialAuthService.authState.subscribe((user) => {
      this.googleUser.next(user);
      this.isGoogleUser.next(!!user);
    });
  }

  signInWithGoogle(): Promise<SocialUser> {
    return this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): Promise<void> {
    return this.socialAuthService.signOut();
  }

  getGoogleUser(): Observable<SocialUser | null> {
    return this.googleUser.asObservable();
  }

  isGoogleAuthenticated(): Observable<boolean> {
    return this.isGoogleUser.asObservable();
  }

  // Convert Google user to our application user format
  convertGoogleUserToAppUser(googleUser: SocialUser): User {
    const [firstName, ...lastNameParts] = googleUser.name.split(' ');
    const lastName = lastNameParts.join(' ') || '';

    return {
      id: Math.floor(Math.random() * 1000), // Generate a random ID
      email: googleUser.email,
      firstName,
      lastName,
      password: '', // No password for Google users
      role: 'user', // Always set role as 'user' for Google authentication
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      recoveryQuestion: {
        question: 'What was your first pet\'s name?',
        answer: '' // No recovery question for Google users
      },
      profilePicture: googleUser.photoUrl || '',
      isActive: true
    };
  }

  // Handle Google sign-in and user creation/update
  async handleGoogleSignIn(googleUser: SocialUser): Promise<User> {
    // Check if user exists
    const existingUser = await firstValueFrom(this.userService.getUserByEmail(googleUser.email));
    
    if (existingUser) {
      // Update existing user with Google info
      const [firstName, ...lastNameParts] = googleUser.name.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      const updatedUser = {
        ...existingUser,
        firstName,
        lastName,
        updatedAt: new Date().toISOString(),
        profilePicture: googleUser.photoUrl || existingUser.profilePicture
      };
      const updateResult = await this.userService.updateUser(updatedUser);
      return await firstValueFrom(updateResult);
    } else {
      // Create new user from Google info
      const newUser = this.convertGoogleUserToAppUser(googleUser);
      const registerResult = await this.userService.registerUser(newUser);
      return await firstValueFrom(registerResult);
    }
  }
} 