import type { routing } from './routing';

// Dynamically extract the type of `routing.locales` array
export type Locale = typeof routing.locales[number];