export interface PerihelionPreset {
  year: number;
  iso: string;
  label: string;
}

/**
 * Curated UTC perihelion instants (approximate seed dataset).
 * Structured for easy replacement with future ephemeris-grade values.
 */
export const PERIHELION_PRESETS: PerihelionPreset[] = [
  { year: 2021, iso: '2021-01-02T13:51:00Z', label: '2021 • Jan 2, 13:51 UTC' },
  { year: 2022, iso: '2022-01-04T06:52:00Z', label: '2022 • Jan 4, 06:52 UTC' },
  { year: 2023, iso: '2023-01-04T16:17:00Z', label: '2023 • Jan 4, 16:17 UTC' },
  { year: 2024, iso: '2024-01-03T00:38:00Z', label: '2024 • Jan 3, 00:38 UTC' },
  { year: 2025, iso: '2025-01-04T13:28:00Z', label: '2025 • Jan 4, 13:28 UTC' },
  { year: 2026, iso: '2026-01-03T17:16:00Z', label: '2026 • Jan 3, 17:16 UTC' },
  { year: 2027, iso: '2027-01-03T01:40:00Z', label: '2027 • Jan 3, 01:40 UTC' },
  { year: 2028, iso: '2028-01-05T12:29:00Z', label: '2028 • Jan 5, 12:29 UTC' },
  { year: 2029, iso: '2029-01-02T23:18:00Z', label: '2029 • Jan 2, 23:18 UTC' }
];

export const DEFAULT_PRESET_YEAR = 2026;

export function findPresetByYear(year: number): PerihelionPreset | undefined {
  return PERIHELION_PRESETS.find((preset) => preset.year === year);
}
