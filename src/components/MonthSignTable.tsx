import { CalendarConfig, DAYS_PER_MONTH, customToGregorian } from '../utils/calendarMath';

interface MonthSignTableProps {
  config: CalendarConfig;
  activeMonth: number;
}

export function MonthSignTable({ config, activeMonth }: MonthSignTableProps) {
  const rows = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const startDay = index * DAYS_PER_MONTH + 1;
    const endDay = startDay + DAYS_PER_MONTH - 1;
    const degreeStart = index * 30;
    const degreeEnd = degreeStart + 30;
    const startGregorian = customToGregorian(month, 1, 0, config);
    const endGregorian = customToGregorian(month, DAYS_PER_MONTH, 0.999, config);

    return {
      month,
      sign: config.zodiacOrder[index] ?? `Sign ${month}`,
      dayRange: `${startDay}-${endDay}`,
      degreeRange: `${degreeStart}°-${degreeEnd}°`,
      gregorianRange: `${startGregorian.toLocaleDateString()} → ${endGregorian.toLocaleDateString()}`
    };
  });

  return (
    <section className="panel">
      <h2>Month / Sign Reference Table</h2>
      <div className="table-wrap">
        <table className="compare-table month-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Sign</th>
              <th>Day range</th>
              <th>Degree range</th>
              <th>Approx Gregorian range</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.month} className={row.month === activeMonth ? 'active-row' : ''}>
                <td>{row.month}</td>
                <td>{row.sign}</td>
                <td>{row.dayRange}</td>
                <td>{row.degreeRange}</td>
                <td>{row.gregorianRange}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
