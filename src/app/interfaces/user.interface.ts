export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // This will store the hashed password
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