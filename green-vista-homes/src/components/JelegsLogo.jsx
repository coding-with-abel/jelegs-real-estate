export function JelegsLogo({ className = "h-9 w-9" }) {
  return (
    <svg
      viewBox="0 0 1080 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="1080" height="1080" rx="180" fill="white" />
      <g>
        {/* Left building */}
        <path
          d="M280 520L380 380L380 820H280V520Z"
          fill="#0F766E"
        />
        <path
          d="M280 820L380 820L380 900L280 780V820Z"
          fill="#0F766E"
        />
        
        {/* Right building */}
        <path
          d="M520 280L700 280L700 820H520V280Z"
          fill="#0F766E"
        />
        <path
          d="M700 820L800 900L800 820H700Z"
          fill="#0F766E"
        />
        
        {/* Bottom anchor */}
        <path
          d="M280 820L520 900L800 820L800 900L520 980L280 900V820Z"
          fill="#0F766E"
        />
      </g>
    </svg>
  );
}