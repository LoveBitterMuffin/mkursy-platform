export type UserRole = 'student' | 'curator' | 'teacher' | 'admin' | 'developer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  groupId?: string;
  assignedGroupIds?: string[];
  createdAt: string;
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  targetExam?: 'oge' | 'ege_profile' | 'olympiad';
  grade?: number;
}

export interface LoginPayload {
  email: string;
  password?: string;
}
