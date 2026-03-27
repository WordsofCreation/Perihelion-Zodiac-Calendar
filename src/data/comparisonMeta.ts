export interface ComparisonLayerMeta {
  key: 'perihelion' | 'tropical' | 'sidereal' | 'gregorian';
  title: string;
  description: string;
}

export const COMPARISON_LAYERS: ComparisonLayerMeta[] = [
  {
    key: 'perihelion',
    title: 'Perihelion calendar',
    description: '360 equal custom days anchored to selected perihelion instant.'
  },
  {
    key: 'tropical',
    title: 'Tropical zodiac',
    description: 'Approximate seasonal longitude from vernal-equinox framing.'
  },
  {
    key: 'sidereal',
    title: 'Sidereal reference',
    description: 'Approximate star-relative longitude with a fixed ayanamsa offset.'
  },
  {
    key: 'gregorian',
    title: 'Gregorian date',
    description: 'Civil date/time context used for comparison and controls.'
  }
];
