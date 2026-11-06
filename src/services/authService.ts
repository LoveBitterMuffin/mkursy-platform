import { User, UserRole, RegisterPayload, LoginPayload } from '../types';
import { initialUsers } from '../data/initialPlatformData';

export class AuthService {
  private users: User[];
  private currentUser: User | null;

  constructor(seedUsers: User[] = initialUsers) {
    this.users = [...seedUsers];
    this.currentUser = this.users[0] ?? null;
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public setCurrentUser(user: User | null): void {
    this.currentUser = user;
  }

  public switchRole(role: UserRole): User {
    const existing = this.users.find(u => u.role === role);
    if (existing) {
      this.currentUser = existing;
      return existing;
    }
    const mockUser: User = {
      id: `user-${role}-demo`,
      email: `${role}@mcourses.ru`,
      name: `Тестовый ${role}`,
      role,
      createdAt: new Date().toISOString(),
    };
    this.users.push(mockUser);
    this.currentUser = mockUser;
    return mockUser;
  }

  public register(payload: RegisterPayload): User {
    if (!payload.name.trim() || !payload.email.trim()) {
      throw new Error('Имя и email обязательны для регистрации');
    }
    const emailNorm = payload.email.trim().toLowerCase();
    if (this.users.some(u => u.email.toLowerCase() === emailNorm)) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: emailNorm,
      name: payload.name.trim(),
      role: payload.role,
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    this.currentUser = newUser;
    return newUser;
  }

  public login(payload: LoginPayload): User {
    const emailNorm = payload.email.trim().toLowerCase();
    const user = this.users.find(u => u.email.toLowerCase() === emailNorm);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    this.currentUser = user;
    return user;
  }

  public getAllUsers(): User[] {
    return [...this.users];
  }

  public getUsersByRole(role: UserRole): User[] {
    return this.users.filter(u => u.role === role);
  }

  public getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }
}

export const authService = new AuthService();
