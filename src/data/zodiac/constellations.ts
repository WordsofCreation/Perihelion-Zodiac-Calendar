export interface ConstellationSpan {
  name: string;
  startDeg: number;
  endDeg: number;
  note?: string;
}

// Educational IAU-like uneven spans of the Sun along the ecliptic, normalized to 360°.
// Includes Ophiuchus as a real ecliptic constellation crossing.
export const CONSTELLATION_SPANS: ConstellationSpan[] = [
  { name: 'Aries', startDeg: 0, endDeg: 24 },
  { name: 'Taurus', startDeg: 24, endDeg: 58 },
  { name: 'Gemini', startDeg: 58, endDeg: 87 },
  { name: 'Cancer', startDeg: 87, endDeg: 110 },
  { name: 'Leo', startDeg: 110, endDeg: 139 },
  { name: 'Virgo', startDeg: 139, endDeg: 186 },
  { name: 'Libra', startDeg: 186, endDeg: 209 },
  { name: 'Scorpio', startDeg: 209, endDeg: 217 },
  { name: 'Ophiuchus', startDeg: 217, endDeg: 235, note: 'Sun crosses this constellation in real sky mapping.' },
  { name: 'Sagittarius', startDeg: 235, endDeg: 266 },
  { name: 'Capricorn', startDeg: 266, endDeg: 293 },
  { name: 'Aquarius', startDeg: 293, endDeg: 323 },
  { name: 'Pisces', startDeg: 323, endDeg: 360 }
];
