import { CONSTELLATION_SPANS } from '../../data/zodiac/constellations';
import { DEFAULT_CUSTOM_ZODIAC_ORDER, TROPICAL_ZODIAC_ORDER } from '../../data/zodiac/equalSigns';
import {
  ANOMALISTIC_YEAR_DAYS,
  ANOMALISTIC_YEAR_MS,
  CUSTOM_YEAR_DAYS,
  DAYS_PER_MONTH,
  EQUINOX_DAY,
  EQUINOX_HOUR_UTC,
  EQUINOX_MONTH,
  SIDEREAL_AYANAMSA_DEGREES,
  SIDEREAL_YEAR_DAYS,
  SIDEREAL_YEAR_MS,
  TROPICAL_YEAR_DAYS,
  TROPICAL_YEAR_MS
} from './constants';
import { AstronomySnapshot, CalendarConfig, CustomDateParts, ZodiacPosition, ZodiacMode } from './types';

const mod = (value: number, n: number): number => ((value % n) + n) % n;

export function parsePerihelionMs(perihelionIso: string): number {
  const ms = Date.parse(perihelionIso);
  return Number.isNaN(ms) ? Date.now() : ms;
}

export function normalizeZodiacOrder(raw: string): string[] {
  const parsed = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return parsed.length === 12 ? parsed : DEFAULT_CUSTOM_ZODIAC_ORDER;
}

function approximateVernalEquinoxMs(gregorianYear: number): number {
  return Date.UTC(gregorianYear, EQUINOX_MONTH, EQUINOX_DAY, EQUINOX_HOUR_UTC, 0, 0);
}

function degreeToEqualSign(degree: number, order: string[]): ZodiacPosition {
  const wrappedDegree = mod(degree, 360);
  const signIndex = Math.floor(wrappedDegree / 30);
  const sign = order[signIndex] ?? `Sign ${signIndex + 1}`;
  const degreeInSign = wrappedDegree - signIndex * 30;

  return { degree: wrappedDegree, sign, degreeInSign, fractionElapsed: wrappedDegree / 360 };
}

function degreeToConstellation(degree: number) {
  const wrapped = mod(degree, 360);
  const span = CONSTELLATION_SPANS.find((item) => wrapped >= item.startDeg && wrapped < item.endDeg) ?? CONSTELLATION_SPANS[0];
  return {
    label: span.name,
    span,
    degreeInConstellation: wrapped - span.startDeg
  };
}

export function gregorianToCustom(target: Date, config: CalendarConfig): CustomDateParts {
  const perihelionMs = parsePerihelionMs(config.perihelionIso);
  const diffMs = target.getTime() - perihelionMs;
  const wrappedMs = mod(diffMs, ANOMALISTIC_YEAR_MS);
  const fractionElapsed = wrappedMs / ANOMALISTIC_YEAR_MS;
  const dayFloat = fractionElapsed * CUSTOM_YEAR_DAYS;

  const dayIndex = Math.floor(dayFloat);
  const dayOfYear = dayIndex + 1;
  const monthIndex = Math.floor(dayIndex / DAYS_PER_MONTH);
  const month = monthIndex + 1;
  const dayOfMonth = (dayIndex % DAYS_PER_MONTH) + 1;
  const sign = config.zodiacOrder[monthIndex] ?? `Sign ${month}`;
  const degree = fractionElapsed * 360;

  return {
    dayOfYear,
    month,
    dayOfMonth,
    sign,
    degree,
    fractionElapsed,
    elapsedMs: wrappedMs,
    untilNextPerihelionMs: ANOMALISTIC_YEAR_MS - wrappedMs
  };
}

export function gregorianToTropical(target: Date): ZodiacPosition {
  const candidate = approximateVernalEquinoxMs(target.getUTCFullYear());
  const anchorMs = target.getTime() >= candidate ? candidate : approximateVernalEquinoxMs(target.getUTCFullYear() - 1);
  const elapsed = mod(target.getTime() - anchorMs, TROPICAL_YEAR_MS);
  return degreeToEqualSign((elapsed / TROPICAL_YEAR_MS) * 360, TROPICAL_ZODIAC_ORDER);
}

export function gregorianToSidereal(target: Date): ZodiacPosition {
  const candidate = approximateVernalEquinoxMs(target.getUTCFullYear());
  const anchorMs = target.getTime() >= candidate ? candidate : approximateVernalEquinoxMs(target.getUTCFullYear() - 1);
  const elapsed = mod(target.getTime() - anchorMs, SIDEREAL_YEAR_MS);
  const degree = (elapsed / SIDEREAL_YEAR_MS) * 360 - SIDEREAL_AYANAMSA_DEGREES;
  return degreeToEqualSign(degree, TROPICAL_ZODIAC_ORDER);
}

export function createAstronomySnapshot(target: Date, config: CalendarConfig, mode: ZodiacMode): AstronomySnapshot {
  const custom = gregorianToCustom(target, config);
  const tropical = gregorianToTropical(target);
  const sidereal = gregorianToSidereal(target);

  const offsets = {
    customVsTropicalDeg: ((custom.degree - tropical.degree + 540) % 360) - 180,
    customVsSiderealDeg: ((custom.degree - sidereal.degree + 540) % 360) - 180,
    tropicalVsSiderealDeg: ((tropical.degree - sidereal.degree + 540) % 360) - 180
  };

  const snapshot: AstronomySnapshot = {
    gregorianTimestamp: target.toISOString(),
    perihelionAnchor: config.perihelionIso,
    anomalistic: {
      degree: custom.degree,
      sign: custom.sign,
      degreeInSign: custom.degree % 30,
      fractionElapsed: custom.fractionElapsed,
      elapsedMs: custom.elapsedMs,
      yearLengthDays: ANOMALISTIC_YEAR_DAYS
    },
    custom,
    tropical: { ...tropical, yearLengthDays: TROPICAL_YEAR_DAYS },
    sidereal: { ...sidereal, yearLengthDays: SIDEREAL_YEAR_DAYS },
    offsets,
    approximationNotes: [
      'Perihelion anchors are curated UTC values and treated as exact app inputs.',
      'Anomalistic/tropical/sidereal year lengths are mean values, not daily ephemeris integration.',
      'Vernal-equinox anchor is a stable approximation used for comparison framing.',
      'Constellation mode is an educational uneven-span overlay, not observatory-grade boundaries.'
    ]
  };

  if (mode === 'constellation') {
    snapshot.constellation = degreeToConstellation(custom.degree);
  }

  return snapshot;
}
