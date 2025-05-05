import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User, RecoveryQuestion } from '../interfaces/user.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private users: User[] = [];
  private recoveryQuestions: RecoveryQuestion[] = [
    { id: '1', question: 'What was your first pet\'s name?' },
    { id: '2', question: 'What city were you born in?' },
    { id: '3', question: 'What is your mother\'s maiden name?' }
  ];

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.http.get<any>('assets/data/db.json').subscribe({
      next: (data) => {
        console.log('Loaded users from db.json:', data.users);
        this.users = data.users;
      },
      error: (error) => {
        console.error('Error loading users from db.json:', error);
        this.users = [];
      }
    });
  }

  private saveUsers(): void {
    // In a real application, this would make an HTTP PUT request to update db.json
    // For now, we'll just update the local users array
    console.log('Updated users array:', this.users);
  }

  getRecoveryQuestions(): RecoveryQuestion[] {
    return this.recoveryQuestions;
  }

  registerUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<User> {
    const newUser: User = {
      ...userData,
      id: Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.push(newUser);
    this.saveUsers();
    return of(newUser);
  }

  async login(email: string, password: string): Promise<Observable<{ success: boolean; user?: User }>> {
    // Ensure users are loaded before proceeding
    if (this.users.length === 0) {
      console.log('Users not loaded yet. Waiting for loadUsers to complete.');
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for users to load
    }
  
    console.log('Attempting login with:', { email, password });
    console.log('Available users:', this.users);
  
    const user = this.users.find(u => u.email === email);
    console.log('Found user:', user);
  
    if (!user) {
      console.log('No user found with email:', email);
      return of({ success: false });
    }
  
    // Validate password
    const isValid = password === user.password;
    console.log('Password validation result:', isValid);
  
    return of({ success: isValid, user: isValid ? user : undefined });
  }

  logout(): void {
    console.log('Logging out...');
    this.currentUser = null; // Clear the in-memory user
    
  }

  getUserByEmail(email: string): Observable<User | null> {
    const user = this.users.find(u => u.email === email);
    return of(user || null);
  }

  async updateUser(user: User): Promise<Observable<User>> {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = { 
        ...user, 
        updatedAt: new Date().toISOString() 
      };
      this.saveUsers();
      return of(this.users[index]);
    }
    return of(user);
  }

  verifyRecoveryAnswer(email: string, answer: string): Observable<boolean> {
    const user = this.users.find(u => u.email === email);
    if (!user) return of(false);
    
    return of(user.recoveryQuestion.answer.toLowerCase() === answer.toLowerCase());
  }

  private currentUser: User | null = null;

  setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

} 