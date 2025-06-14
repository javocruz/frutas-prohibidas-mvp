export interface LoginFormData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<User>;
  checkAuth: () => Promise<User | null>;
} 