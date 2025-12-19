export interface Person {
  id: string;
  name: string;
}

export enum AppMode {
  INPUT = 'INPUT',
  LUCKY_DRAW = 'LUCKY_DRAW',
  GROUPING = 'GROUPING',
}

export interface Group {
  id: number;
  members: Person[];
}

export interface LuckyDrawSettings {
  allowRepeat: boolean;
}

export interface GroupingSettings {
  groupSize: number;
}

export interface Prize {
  id: string;
  name: string;
}

export interface HistoryRecord extends Person {
  prize: Prize;
  drawnAt: number;
}
