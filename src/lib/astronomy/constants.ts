export const CUSTOM_YEAR_DAYS = 360;
export const MONTHS = 12;
export const DAYS_PER_MONTH = 30;

export const STANDARD_DAY_SECONDS = 86_400;
export const CUSTOM_DAY_SECONDS = 24 * 3600 + 21 * 60 + 2.31;
export const EXTRA_DAY_SECONDS = CUSTOM_DAY_SECONDS - STANDARD_DAY_SECONDS;
export const EXTRA_SECONDS_PER_HOUR = EXTRA_DAY_SECONDS / 24;

// Mean year lengths in SI days.
export const TROPICAL_YEAR_DAYS = 365.24219;
export const SIDEREAL_YEAR_DAYS = 365.25636;
export const ANOMALISTIC_YEAR_DAYS = 365.259636;

export const TROPICAL_YEAR_MS = TROPICAL_YEAR_DAYS * STANDARD_DAY_SECONDS * 1000;
export const SIDEREAL_YEAR_MS = SIDEREAL_YEAR_DAYS * STANDARD_DAY_SECONDS * 1000;
export const ANOMALISTIC_YEAR_MS = ANOMALISTIC_YEAR_DAYS * STANDARD_DAY_SECONDS * 1000;

// Educational mean ayanamsa approximation for sidereal framing.
export const SIDEREAL_AYANAMSA_DEGREES = 24;

// Mean vernal equinox approximation anchor.
export const EQUINOX_MONTH = 2;
export const EQUINOX_DAY = 20;
export const EQUINOX_HOUR_UTC = 9;
