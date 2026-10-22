export function HeroArt({ caption, meta }: { caption: string; meta: string }) {
  return (
    <figure className="plate">
      <svg viewBox="0 0 400 500" aria-hidden="true">
        <path
          d="M70 430 V156 C70 78 330 78 330 156 V430"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M98 430 V172 C98 108 302 108 302 172 V430"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.55"
        />
        <circle cx="200" cy="230" r="86" fill="none" stroke="#E2B15A" strokeWidth="0.8" />
        <path
          fill="#F2D48A"
          fillRule="evenodd"
          d="M200 132c0 0-36 58-36 104 0 28 16 52 36 52s36-24 36-52c0-46-36-104-36-104zm0 34c0 0-18 32-18 52 0 16 8 28 18 28s18-12 18-28c0-20-18-52-18-52z"
        />
        <path
          d="M148 292c18 8 86 8 104 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M162 294c10 30 66 30 76 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M118 378c28-16 56-16 82 0v52c-26-16-54-16-82 0v-52z"
          fill="currentColor"
          opacity="0.12"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M200 378c26-16 54-16 82 0v52c-28-16-56-16-82 0v-52z"
          fill="currentColor"
          opacity="0.12"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path d="M200 370v64" stroke="currentColor" strokeWidth="1.2" />
        <path d="M64 430h272" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <figcaption>
        <span>{caption}</span>
        <span>{meta}</span>
      </figcaption>
    </figure>
  );
}
