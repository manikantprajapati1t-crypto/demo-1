import { marqueeWords } from "../data/content";

export function Marquee() {
  const row = [...marqueeWords, ...marqueeWords];
  return (
    <div
      className="relative overflow-hidden bg-terracotta py-5 text-ivory md:py-6"
      aria-hidden="true"
    >
      <div className="animate-marquee flex w-max whitespace-nowrap">
        {[0, 1].map((k) => (
          <div key={k} className="flex items-center">
            {row.map((w, i) => (
              <span key={`${k}-${i}`} className="flex items-center">
                <span className="px-6 font-serif text-3xl italic md:px-10 md:text-5xl">{w}</span>
                <span className="text-xl text-forest md:text-2xl">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
