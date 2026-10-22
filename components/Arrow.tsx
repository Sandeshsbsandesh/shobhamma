export function Heart() {
  return (
    <svg className="heart" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 13.4 3.1 8.7a2.9 2.9 0 0 1 4.1-4.1L8 5.4l.8-.8a2.9 2.9 0 1 1 4.1 4.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Arrow() {
  return (
    <svg className="arrow" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M3 9h12M11 5l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
