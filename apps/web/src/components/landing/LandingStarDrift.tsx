"use client";

export function LandingStarDrift() {
  return (
    <div
      className="landing-star-drift pointer-events-none absolute -right-[8%] top-[8%] z-0 hidden h-[min(72vw,560px)] w-[min(72vw,560px)] opacity-80 md:block"
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/landing-star.svg"
        alt=""
        className="h-full w-full object-contain"
      />
    </div>
  );
}
