// Internes Hilfsmodul: wird NICHT in public-api.ts exportiert und ist damit kein Teil des Vertrags.
export type BadgeLevel = 'Einsteiger' | 'Fortgeschritten' | 'Experte';

export function levelClass(level: BadgeLevel): string {
  switch (level) {
    case 'Einsteiger':
      return 'eh-badge--ok';
    case 'Fortgeschritten':
      return 'eh-badge--info';
    case 'Experte':
      return 'eh-badge--warn';
  }
}
