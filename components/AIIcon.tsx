const artwork = {
  intelligence: <><rect x="13" y="13" width="22" height="22" rx="6"/><path d="M19 5v8m10-8v8M19 35v8m10-8v8M5 19h8m-8 10h8m22-10h8m-8 10h8M20 25l4-7 4 7-4 5-4-5Z"/></>,
  records: <><path d="M12 7h19l7 7v23a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V11a4 4 0 0 1 4-4Zm18 0v9h8M15 21h10M15 27h7M15 33h7M28 27h6v7h-6zM31 23v4m0 7v4m-7-7h4m6 0h7"/></>,
  emergency: <><path d="M10 34V23a14 14 0 0 1 28 0v11M7 35h34v6H7zM24 3v3M5 11l4 4m30 0 4-4M3 25h4m34 0h4M24 15l-5 9h9l-5 8"/></>,
  governance: <><path d="m24 5 15 6v12c0 9-9 16-15 20-6-4-15-11-15-20V11L24 5Z"/><path d="M17 19h6l5 5v7m-5-12 5-5h5M17 19v12"/><circle cx="17" cy="19" r="2"/><circle cx="17" cy="33" r="2"/><circle cx="28" cy="33" r="2"/><circle cx="35" cy="14" r="2"/></>,
  training: <><path d="M24 14c-6-5-13-6-19-5v27c7-1 13 0 19 5 6-5 12-6 19-5V9c-6-1-13 0-19 5Zm0 0v27M11 17h5v7h4m17-7h-5v7h-4"/><circle cx="12" cy="30" r="2"/><circle cx="36" cy="30" r="2"/></>,
  leadership: <><circle cx="24" cy="13" r="6"/><path d="M14 31v-2a10 10 0 0 1 20 0v2M24 31v7M10 38h28M10 34v4m28-4v4"/><circle cx="10" cy="41" r="3"/><circle cx="24" cy="41" r="3"/><circle cx="38" cy="41" r="3"/></>,
  automation: <><rect x="18" y="18" width="12" height="12" rx="3"/><path d="M24 18V8H10m20 16h10v14M24 30v10H10M18 24H8V10M20 24h8m-4-4v8"/><circle cx="8" cy="7" r="3"/><circle cx="8" cy="40" r="3"/><circle cx="40" cy="41" r="3"/><circle cx="40" cy="8" r="3"/><path d="M30 8h7"/></>,
  discovery: <><circle cx="21" cy="21" r="14"/><path d="m31 31 11 11M14 24l7-11 7 11-7 5-7-5Z"/><circle cx="21" cy="21" r="2"/></>,
  assessment: <><path d="M9 7h28v34H9zM16 33v-6m8 6V21m8 12V17M15 14h7"/><circle cx="32" cy="12" r="2"/><path d="M24 12h6"/></>,
  pilot: <><path d="M18 5h12m-9 0v13L9 36a4 4 0 0 0 3 6h24a4 4 0 0 0 3-6L27 18V5M16 29h16"/><circle cx="21" cy="34" r="2"/><circle cx="29" cy="37" r="1"/></>,
  rollout: <><rect x="18" y="5" width="12" height="12" rx="3"/><rect x="5" y="32" width="10" height="10" rx="3"/><rect x="19" y="32" width="10" height="10" rx="3"/><rect x="33" y="32" width="10" height="10" rx="3"/><path d="M24 17v15M10 32v-8h28v8"/></>,
  workload: <><path d="M7 36a19 19 0 1 1 34 0M15 19l3 3m15-3-3 3M24 11v5M9 30h5m20 0h5M24 31l6-11M11 41h26"/><circle cx="24" cy="31" r="4"/></>,
  knowledge: <><ellipse cx="24" cy="10" rx="15" ry="6"/><path d="M9 10v25c0 8 30 8 30 0V10M9 22c0 8 30 8 30 0M17 33h4l3-4 3 4h4"/></>,
  communication: <><path d="M10 8h28a5 5 0 0 1 5 5v17a5 5 0 0 1-5 5H21L10 43v-8a5 5 0 0 1-5-5V13a5 5 0 0 1 5-5Z"/><circle cx="15" cy="22" r="2"/><circle cx="24" cy="17" r="2"/><circle cx="33" cy="25" r="2"/><path d="m17 21 5-3m4 1 5 4"/></>,
  progress: <><path d="M7 7v34h34M14 32l8-10 7 5 12-17M32 10h9v9"/><circle cx="14" cy="32" r="2"/><circle cx="22" cy="22" r="2"/><circle cx="29" cy="27" r="2"/></>,
  newsletter: <><rect x="5" y="12" width="38" height="29" rx="4"/><path d="m5 16 19 13 19-13M5 37l12-11m26 11L31 26M17 7h14M24 3v9"/><circle cx="24" cy="7" r="3"/></>,
  youtube: <><rect x="5" y="10" width="38" height="28" rx="7"/><path d="m20 18 11 6-11 6V18Z" fill="currentColor" stroke="none"/></>,
  podcast: <><circle cx="24" cy="24" r="4" fill="currentColor" stroke="none"/><path d="M16 32a11 11 0 0 1 0-16m16 0a11 11 0 0 1 0 16M11 37a18 18 0 0 1 0-26m26 0a18 18 0 0 1 0 26"/></>,
  calendar: <><rect x="6" y="9" width="36" height="33" rx="4"/><path d="M15 5v9m18-9v9M6 19h36M16 29h7l7 6m-7-6 7-5"/><circle cx="15" cy="29" r="2"/><circle cx="32" cy="24" r="2"/><circle cx="32" cy="36" r="2"/></>,
  search: <><circle cx="21" cy="21" r="13"/><path d="m31 31 11 11"/></>,
  send: <><path d="m6 23 36-17-17 36-5-16-14-3Zm14 3L42 6"/></>,
  download: <><path d="M24 6v24m-9-9 9 9 9-9M8 32v10h32V32"/></>,
} as const;

export type IconType = keyof typeof artwork;

export function Icon({ type, size = 48, className = '' }: { type: IconType; size?: number; className?: string }) {
  return <svg className={`ai-line-icon ${className}`} width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={size < 30 ? 2.8 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" data-ai-icon={type}>{artwork[type]}</svg>;
}
