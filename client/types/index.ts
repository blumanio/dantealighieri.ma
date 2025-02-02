// types/index.ts
export type Language = 'en' | 'ar' | 'it';

export interface MenuItem {
  about: string;
  universities: string;
  apply: string;
  soon: string;
}

export interface MenuItems {
  [key: string]: MenuItem;
}

export interface MobileNavProps {
  menuItems: MenuItems;
}

export interface LanguageNames {
  [key: string]: {
    [key: string]: string;
  };
}