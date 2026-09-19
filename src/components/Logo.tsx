export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="CapX" className={className}>
      <path d="M24 2 44 13v22L24 46 4 35V13Z" fill="#003b71" />
      <path
        d="M23.6 18.7a7.5 7.5 0 1 0 0 10.6"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path d="M28.8 18.6 37.8 29.4" stroke="#ee2737" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M37.8 18.6 28.8 29.4" stroke="#ee2737" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}
