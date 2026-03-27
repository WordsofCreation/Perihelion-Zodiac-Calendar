import { CUSTOM_DAY_SECONDS, CUSTOM_YEAR_DAYS, DAYS_PER_MONTH, MONTHS } from '../astronomy/constants';
import { CalendarConfig } from '../astronomy/types';
import { parsePerihelionMs } from '../astronomy/engine';

export function customToGregorian(month: number, dayOfMonth: number, fractionWithinDay: number, config: CalendarConfig): Date {
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
