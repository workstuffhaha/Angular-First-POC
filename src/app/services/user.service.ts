import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User, RecoveryQuestion } from '../interfaces/user.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root' //makes it available to the entire application
})
export class UserService {
  private apiUrl = environment.apiUrl; // stores the base URL for the API loaded from environment.ts
  private users: User[] = [];
  private recoveryQuestions: RecoveryQuestion[] = [
    { id: '1', question: 'What was your first pet\'s name?' },
    { id: '2', question: 'What city were you born in?' },
    { id: '3', question: 'What is your mother\'s maiden name?' }
  ];

  constructor(private http: HttpClient) { //HttpClient is injected to make HTTP requests
    this.loadUsers(); //automatically load users when the service is instantiated
  }

  //fetches the users from a local JSON file (db.json) using GET 
  private loadUsers(): void {
    //this.http.get<any> makes an HTTP GET request, which returns an Observable that emits the response data when the request is successful.
    //.subscribe helps you to subscribe to the observable that is returned. handle the emitted data/errors.
    this.http.get<any>('assets/data/db.json').subscribe({

      //next callback is executed when the request is successful and the data is received.
      next: (data) => {
        console.log('Loaded users from db.json:', data.users);
        this.users = data.users;
      },

      //error callback is executed when there is an error in the request.
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


  //service method, simulates user registration, new user is added in-memory, returns the new user as an observable.

  //Observable<User> - wraps the new user as an Observable. it is the return type of the method.

  //using Omit - only valid data is accepted.

  registerUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<User> {
    const newUser: User = {
      ...userData, //include all properties from the userData
      id: Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.push(newUser);
    this.saveUsers();
    return of(newUser); // of() is from RxJs, creates an observable that emits the new user.
  }


  //asynchronous authentication service method
  //return type - a promise that resolves to an observable of an object containing success status and user data.

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
      return of({ success: false }); // returns an observable with success status false.
    }
  
    // Validate password
    const isValid = password === user.password;
    console.log('Password validation result:', isValid);
    
    // returns an observable with success status and user data if valid.
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


  //same thing here, the return type is a promise that resolves to an observable of the updated user.

  async updateUser(user: User): Promise<Observable<User>> {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) { //user exists in the array
      this.users[index] = { 
        ...user,  
        updatedAt: new Date().toISOString() //updatedAt is updated
      };
      this.saveUsers();
      return of(this.users[index]); //returns an observable of the updated user.
    }
    return of(user); // if the user wasnt found
  }

  
  //returns an observable of the type boolean, indicating whether the email is valid or not.
  verifyRecoveryAnswer(email: string, answer: string): Observable<boolean> {
    const user = this.users.find(u => u.email === email);
    if (!user) return of(false);
    
    return of(user.recoveryQuestion.answer.toLowerCase() === answer.toLowerCase()); //compares the answer, uses Observable to wrap the result.
  }

  private currentUser: User | null = null;

  setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

} 