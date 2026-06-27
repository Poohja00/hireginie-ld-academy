const P = {
  compass: '<circle cx="12" cy="12" r="9"/><polygon points="16 8 10 10 8 16 14 14 16 8"/>',
  chart: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-4"/><path d="M13 16V8"/><path d="M18 16v-7"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5 3 3 0 0 0 2 5 3 3 0 0 0 3 2V4z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5 3 3 0 0 1-2 5 3 3 0 0 1-3 2V4z"/>',
  steps: '<path d="M4 18h4v-4h4v-4h4V6h4"/>',
  scale: '<path d="M12 4v16"/><path d="M5 8h14"/><path d="M5 8l-2 5h4z"/><path d="M19 8l2 5h-4z"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M4 19a5 5 0 0 1 10 0"/><path d="M16 6a3 3 0 0 1 0 6"/><path d="M18 19a5 5 0 0 0-3-4.6"/>',
  wrench: '<path d="M14 7a4 4 0 0 0-5 5l-5 5 2 2 5-5a4 4 0 0 0 5-5l-2 2-2-2 2-2z"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>',
  door: '<path d="M3 21h18"/><path d="M6 21V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v17"/><circle cx="13" cy="12" r="1"/>',
  trend: '<path d="M3 17l6-6 4 4 7-7"/><path d="M17 8h4v4"/>',
  coin: '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 10.5a2.5 2 0 0 1 5 0c0 2-5 1-5 3a2.5 2 0 0 0 5 0"/>',
  activity: '<path d="M3 12h4l3 8 4-16 3 8h4"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
  flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
  handshake: '<path d="M8 12l3 3 5-5 3 3"/><path d="M3 10l5-5 4 4"/><path d="M13 7l4-2 4 4-3 3"/>',
  route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h1"/>',
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
  layers: '<polygon points="12 3 21 8 12 13 3 8 12 3"/><path d="M3 13l9 5 9-5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z"/>',
  award: '<circle cx="12" cy="9" r="5"/><path d="M9 13l-1 8 4-3 4 3-1-8"/>',
  check: '<path d="M5 12l5 5 9-11"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
  bolt: '<path d="M13 2 3 14h7l-1 8 10-12h-7z"/>',
  play: '<path d="M7 4v16l13-8z"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
}

export function Icon({ name, className = '' }) {
  return (
    <svg
      className={`icon inline-block flex-none ${className}`}
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: P[name] || '' }}
    />
  )
}

export const ICON_NAMES = P
