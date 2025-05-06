export interface User { //export makes it available for import in other files
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // This should store the hashed password
  role: 'admin' | 'user';
  recoveryQuestion: {
    question: string;
    answer: string;
  };
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface RecoveryQuestion {
  id: string;
  question: string;
}

export type UserRole = 'admin' | 'user'; 

//This interface would typically be used when:

//Defining API response shapes

//Creating new user objects

//Typing function parameters that handle user data