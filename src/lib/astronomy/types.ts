import { ConstellationSpan } from '../../data/zodiac/constellations';

export interface CalendarConfig {
  perihelionIso: string;
  zodiacOrder: string[];
}

export interface ZodiacPosition {
  degree: number;
  sign: string;
  degreeInSign: number;
  fractionElapsed: number;
}

export interface CustomDateParts {
  dayOfYear: number;
  month: number;
  dayOfMonth: number;
  sign: string;
  degree: number;
  fractionElapsed: number;
  elapsedMs: number;
  untilNextPerihelionMs: number;
}

export type ZodiacMode = 'equal' | 'constellation';

export interface AstronomySnapshot {
  gregorianTimestamp: string;
  perihelionAnchor: string;
  anomalistic: ZodiacPosition & { elapsedMs: number; yearLengthDays: number };
  custom: CustomDateParts;
  tropical: ZodiacPosition & { yearLengthDays: number };
  sidereal: ZodiacPosition & { yearLengthDays: number };
  offsets: {
    customVsTropicalDeg: number;
    customVsSiderealDeg: number;
    tropicalVsSiderealDeg: number;
  };
  constellation?: {
    label: string;
    span: ConstellationSpan;
    degreeInConstellation: number;
  };
  approximationNotes: string[];
}
