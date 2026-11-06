import { describe, it, expect, beforeEach } from 'vitest';
import { AuthService } from '../src/services/authService';

describe('AuthService (AC-01)', () => {
  let auth: AuthService;

  beforeEach(() => {
    auth = new AuthService([]);
  });

  it('registers a new student successfully', () => {
    const student = auth.register({
      name: 'Алексей Смирнов',
      email: 'alex@example.com',
      role: 'student',
    });
    expect(student.id).toBeDefined();
    expect(student.name).toBe('Алексей Смирнов');
    expect(student.role).toBe('student');
    expect(auth.getCurrentUser()?.email).toBe('alex@example.com');
  });

  it('prevents duplicate email registration', () => {
    auth.register({ name: 'User 1', email: 'test@example.com', role: 'student' });
    expect(() => {
      auth.register({ name: 'User 2', email: 'TEST@example.com', role: 'teacher' });
    }).toThrow('Пользователь с таким email уже существует');
  });

  it('allows seamless role switching for administrators, curators, and teachers', () => {
    const teacher = auth.switchRole('teacher');
    expect(teacher.role).toBe('teacher');
    expect(auth.getCurrentUser()?.role).toBe('teacher');

    const curator = auth.switchRole('curator');
    expect(curator.role).toBe('curator');
    expect(auth.getCurrentUser()?.role).toBe('curator');

    const admin = auth.switchRole('admin');
    expect(admin.role).toBe('admin');
    expect(auth.getCurrentUser()?.role).toBe('admin');

    const dev = auth.switchRole('developer');
    expect(dev.role).toBe('developer');
    expect(auth.getCurrentUser()?.role).toBe('developer');
  });

  it('authenticates existing user on login', () => {
    auth.register({ name: 'Иван', email: 'ivan@test.com', role: 'student' });
    auth.setCurrentUser(null);
    expect(auth.getCurrentUser()).toBeNull();

    const logged = auth.login({ email: 'ivan@test.com' });
    expect(logged.email).toBe('ivan@test.com');
    expect(auth.getCurrentUser()?.id).toBe(logged.id);
  });
});
