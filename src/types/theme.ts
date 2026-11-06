export type ThemeMode = 'light' | 'dark';

export interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
}
