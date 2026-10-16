export type Locale = 'en' | 'hi';

export const defaultLocale: Locale = 'en';

export const locales: { code: Locale; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
];
