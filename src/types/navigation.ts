import { UserRole } from './auth';

export type AppView =
  | 'tree'
  | 'dashboard'
  | 'editor'
  | 'courses'
  | 'crm'
  | 'groups'
  | 'homework'
  | 'devtools'
  | 'player';

export interface NavItemConfig {
  id: AppView;
  label: string;
}

export function getViewsForRole(role: UserRole): AppView[] {
  switch (role) {
    case 'student':
      return ['tree', 'homework', 'groups', 'dashboard', 'courses'];
    case 'curator':
      return ['groups', 'homework', 'dashboard'];
    case 'teacher':
      return ['groups', 'homework', 'editor', 'tree'];
    case 'admin':
      return ['crm', 'groups', 'courses', 'editor'];
    case 'developer':
      return ['devtools', 'crm', 'groups', 'homework', 'tree', 'dashboard', 'editor', 'courses'];
    default:
      return ['tree', 'courses'];
  }
}
