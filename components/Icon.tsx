/**
 * Inline SVG icons (server-rendered, ~200 bytes each, no icon library or font). Stroke icons on a 24-unit grid,
 * drawn for this site. Decorative by default (aria-hidden); pass `label` when an icon carries meaning on its own.
 */
const PATHS = {
  // Categories
  math: 'M12 6v12M6 12h12',
  statistics: 'M4 20h16M7 16v-4M12 16V7M17 16v-7',
  'everyday-life': 'M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 10h16M8 3v4M16 3v4',
  construction: 'M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5M10 20v-5h4v5',
  finance: 'M3 7h18v10H3zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6.5 7v10M17.5 7v10',
  pets: 'M8.5 6.5a1.5 1.8 0 1 0 0 .01M15.5 6.5a1.5 1.8 0 1 0 0 .01M5.5 11a1.4 1.7 0 1 0 0 .01M18.5 11a1.4 1.7 0 1 0 0 .01M12 12c-3 0-5 3-5 5 0 1.7 1.3 2.5 2.8 2.5 1 0 1.5-.5 2.2-.5s1.2.5 2.2.5c1.5 0 2.8-.8 2.8-2.5 0-2-2-5-5-5z',
  food: 'M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M16 3c-2 1.5-2.5 4-2.5 7H17V3M17 10v11',
  sports: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3.5 9.5c3 1.5 6 1 8.5-1.5s4-5 3.5-4M8.5 20.5c0-4 2.5-7 6-8.5 2.5-1 5-.5 6 0',
  // UI
  calculator: 'M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 7h8v3H8zM8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01M16 17.5h.01',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5',
  shield: 'M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z',
  code: 'M9 8l-4 4 4 4M15 8l4 4-4 4',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18',
} as const;

export type IconName = keyof typeof PATHS;

export const categoryIcon = (slug: string): IconName => (slug in PATHS ? (slug as IconName) : 'calculator');

export default function Icon({ name, size = 20, label, className }: { name: IconName; size?: number; label?: string; className?: string }) {
  return (
    <svg
      className={className ? `icon ${className}` : 'icon'}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true, focusable: false })}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
