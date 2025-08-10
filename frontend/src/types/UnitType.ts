export const UnitType = {
  Gramas: 'g',
  Quilogramas: 'kg',
  Mililitros: 'ml',
  Litros: 'l',
  ColherSopa: 'colher de sopa',
  ColherCha: 'colher de chá',
  Unidade: 'unidade',
} as const;

export type UnitType = typeof UnitType[keyof typeof UnitType];
