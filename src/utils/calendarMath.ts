import { DEFAULT_CUSTOM_ZODIAC_ORDER, TROPICAL_ZODIAC_ORDER } from '../data/zodiac';

export const CUSTOM_YEAR_DAYS = 360;
export const MONTHS = 12;
export const DAYS_PER_MONTH = 30;

export const CUSTOM_DAY_SECONDS = 24 * 3600 + 21 * 60 + 2.31;
export const STANDARD_DAY_SECONDS = 24 * 3600;
export const EXTRA_DAY_SECONDS = CUSTOM_DAY_SECONDS - STANDARD_DAY_SECONDS;
export const EXTRA_SECONDS_PER_HOUR = EXTRA_DAY_SECONDS / 24;

export const TROPICAL_YEAR_DAYS = 365.2422;
export const SIDEREAL_YEAR_DAYS = 365.25636;
export const ANOMALISTIC_YEAR_DAYS = (CUSTOM_YEAR_DAYS * CUSTOM_DAY_SECONDS) / STANDARD_DAY_SECONDS;

// Fixed reference for this phase (designed approximation, not high-precision ephemeris).
export const SIDEREAL_AYANAMSA_DEGREES = 24;

export interface CalendarConfig {
  perihelionIso: string;
  zodiacOrder: string[];
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

export interface ZodiacPosition {
  degree: number;
  sign: string;
  degreeInSign: number;
  fractionElapsed: number;
}

export const meanYearMs = CUSTOM_YEAR_DAYS * CUSTOM_DAY_SECONDS * 1000;
const tropicalYearMs = TROPICAL_YEAR_DAYS * STANDARD_DAY_SECONDS * 1000;
const siderealYearMs = SIDEREAL_YEAR_DAYS * STANDARD_DAY_SECONDS * 1000;

const mod = (value: number, n: number): number => ((value % n) + n) % n;

export function parsePerihelionMs(perihelionIso: string): number {
  const ms = Date.parse(perihelionIso);
  if (Number.isNaN(ms)) {
    return Date.now();
  }
  return ms;
}

export function normalizeZodiacOrder(raw: string): string[] {
  const parsed = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (parsed.length !== 12) {
    return DEFAULT_CUSTOM_ZODIAC_ORDER;
  }

  return parsed;
}

/**
 * Maps a Gregorian timestamp to the designed perihelion calendar.
 */
export function gregorianToCustom(target: Date, config: CalendarConfig): CustomDateParts {
  const perihelionMs = parsePerihelionMs(config.perihelionIso);
  const diffMs = target.getTime() - perihelionMs;
  const wrappedMs = mod(diffMs, meanYearMs);
  const fractionElapsed = wrappedMs / meanYearMs;
  const dayFloat = fractionElapsed * CUSTOM_YEAR_DAYS;

  const dayIndex = Math.floor(dayFloat);
  const dayOfYear = dayIndex + 1;
  const monthIndex = Math.floor(dayIndex / DAYS_PER_MONTH);
  const month = monthIndex + 1;
  const dayOfMonth = (dayIndex % DAYS_PER_MONTH) + 1;
  const sign = config.zodiacOrder[monthIndex] ?? `Sign ${month}`;
  const degree = fractionElapsed * 360;
  const untilNextPerihelionMs = meanYearMs - wrappedMs;

  return {
    dayOfYear,
    month,
    dayOfMonth,
    sign,
    degree,
    fractionElapsed,
    elapsedMs: wrappedMs,
    untilNextPerihelionMs
  };
}

function approximateVernalEquinoxMs(gregorianYear: number): number {
  // Stable approximation anchor for visualization workflows.
  return Date.UTC(gregorianYear, 2, 20, 9, 0, 0);
}

function degreeToZodiac(degree: number, order: string[]): ZodiacPosition {
  const wrappedDegree = mod(degree, 360);
  const signIndex = Math.floor(wrappedDegree / 30);
  const sign = order[signIndex] ?? `Sign ${signIndex + 1}`;
  const degreeInSign = wrappedDegree - signIndex * 30;

  return {
    degree: wrappedDegree,
    sign,
    degreeInSign,
    fractionElapsed: wrappedDegree / 360
  };
}

export function gregorianToTropical(target: Date): ZodiacPosition {
  const candidate = approximateVernalEquinoxMs(target.getUTCFullYear());
  const anchorMs = target.getTime() >= candidate ? candidate : approximateVernalEquinoxMs(target.getUTCFullYear() - 1);
  const elapsed = mod(target.getTime() - anchorMs, tropicalYearMs);
  return degreeToZodiac((elapsed / tropicalYearMs) * 360, TROPICAL_ZODIAC_ORDER);
}

export function gregorianToSidereal(target: Date): ZodiacPosition {
  const candidate = approximateVernalEquinoxMs(target.getUTCFullYear());
  const anchorMs = target.getTime() >= candidate ? candidate : approximateVernalEquinoxMs(target.getUTCFullYear() - 1);
  const elapsed = mod(target.getTime() - anchorMs, siderealYearMs);
  const siderealDegree = (elapsed / siderealYearMs) * 360 - SIDEREAL_AYANAMSA_DEGREES;
  return degreeToZodiac(siderealDegree, TROPICAL_ZODIAC_ORDER);
}

export function customToGregorian(
  month: number,
  dayOfMonth: number,
  fractionWithinDay: number,
  config: CalendarConfig
): Date {
  const safeMonth = Math.min(Math.max(month, 1), MONTHS);
  const safeDay = Math.min(Math.max(dayOfMonth, 1), DAYS_PER_MONTH);
  const safeFrac = Math.min(Math.max(fractionWithinDay, 0), 0.999999);

  const dayIndex = (safeMonth - 1) * DAYS_PER_MONTH + (safeDay - 1);
  const offsetMs = (dayIndex + safeFrac) * CUSTOM_DAY_SECONDS * 1000;
  const perihelionMs = parsePerihelionMs(config.perihelionIso);
  return new Date(perihelionMs + offsetMs);
}

export function sliderToGregorian(dayInYear: number, config: CalendarConfig): Date {
  const dayZeroBased = Math.min(Math.max(dayInYear, 0), CUSTOM_YEAR_DAYS);
  const perihelionMs = parsePerihelionMs(config.perihelionIso);
  return new Date(perihelionMs + dayZeroBased * CUSTOM_DAY_SECONDS * 1000);
}

export function formatDuration(ms: number): string {
  const abs = Math.abs(ms);
  const seconds = Math.floor(abs / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString();
}
