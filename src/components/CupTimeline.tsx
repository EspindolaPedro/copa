import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RED = "oklch(0.64 0.23 25)";

type Edition = {
  year: string;
  host: string;
  champion: string;
  flag: string; // country code for flagcdn
  ball: string;
  mascot: string;
  highlight: string;
  accent: string; // background color per era
  stickers: { label: string; emoji: string }[];
};

const EDITIONS: Edition[] = [
  {
    year: "1970", host: "MÉXICO", champion: "BRASIL", flag: "br",
    ball: "Telstar", mascot: "Juanito", highlight: "Pelé eterniza o tri.",
    accent: "oklch(0.55 0.18 145)",
    stickers: [
      { label: "PELÉ", emoji: "👑" }, { label: "JAIRZINHO", emoji: "⚡" },
      { label: "CARLOS A.", emoji: "🏆" }, { label: "RIVELINO", emoji: "🎯" },
      { label: "TOSTÃO", emoji: "🇧🇷" },
    ],
  },
  {
    year: "1986", host: "MÉXICO", champion: "ARGENTINA", flag: "ar",
    ball: "Azteca", mascot: "Pique", highlight: "A Mão de Deus de Maradona.",
    accent: "oklch(0.55 0.16 240)",
    stickers: [
      { label: "MARADONA", emoji: "🪄" }, { label: "VALDANO", emoji: "⚽" },
      { label: "BURRUCHAGA", emoji: "🎯" }, { label: "GIUSTI", emoji: "🛡️" },
      { label: "PUMPIDO", emoji: "🧤" },
    ],
  },
  {
    year: "2002", host: "JPN/KOR", champion: "BRASIL", flag: "br",
    ball: "Fevernova", mascot: "Spheriks", highlight: "Penta com Ronaldo Fenômeno.",
    accent: "oklch(0.50 0.2 30)",
    stickers: [
      { label: "RONALDO", emoji: "🌟" }, { label: "RIVALDO", emoji: "🪄" },
      { label: "RONALDINHO", emoji: "😁" }, { label: "CAFU", emoji: "🇧🇷" },
      { label: "ROBERTO C.", emoji: "🚀" },
    ],
  },
  {
    year: "2014", host: "BRASIL", champion: "ALEMANHA", flag: "de",
    ball: "Brazuca", mascot: "Fuleco", highlight: "7×1 e a Alemanha tetra.",
    accent: "oklch(0.45 0.12 60)",
    stickers: [
      { label: "MÜLLER", emoji: "🎯" }, { label: "KROOS", emoji: "🎼" },
      { label: "NEUER", emoji: "🧤" }, { label: "GÖTZE", emoji: "✨" },
      { label: "LAHM", emoji: "👑" },
    ],
  },
  {
    year: "2022", host: "CATAR", champion: "ARGENTINA", flag: "ar",
    ball: "Al Rihla", mascot: "La’eeb", highlight: "Messi finalmente levanta a taça.",
    accent: "oklch(0.45 0.18 265)",
    stickers: [
      { label: "MESSI", emoji: "🐐" }, { label: "DI MARIA", emoji: "🎯" },
      { label: "DYBALA", emoji: "🔥" }, { label: "MARTÍNEZ", emoji: "🧤" },
      { label: "JULIÁN A.", emoji: "⚡" },
    ],
  },
  {
    year: "2026", host: "USA · CAN · MEX", champion: "?", flag: "us",
    ball: "Trionda", mascot: "Maple, Zayu & Clutch", highlight: "48 seleções. A maior copa de todas.",
    accent: "oklch(0.64 0.23 25)",
    stickers: [
      { label: "MBAPPÉ", emoji: "🇫🇷" }, { label: "BELLINGHAM", emoji: "🇬🇧" },
      { label: "VINI JR", emoji: "🇧🇷" }, { label: "HAALAND", emoji: "🇳🇴" },
      { label: "PEDRI", emoji: "🇪🇸" },
    ],
  },
];

export function CupTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const totalWidth = track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: "top top",
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(EDITIONS.length - 1, Math.round(self.progress * (EDITIONS.length - 1)));
            setActive(idx);
          },
        },
      });

      return () => { tween.scrollTrigger?.kill(); tween.kill(); };
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const current = EDITIONS[active];

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: current.accent, transition: "background-color 0.7s ease" }}
    >
      {/* grid backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      {/* HEADER */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col items-center px-6 pt-10 text-center md:pt-14">
        <div className="font-condensed text-xs tracking-[0.5em] text-white/60 md:text-sm">UMA COPA POR VEZ</div>
        <h2 className="mt-3 font-display text-5xl leading-none tracking-tight text-white md:text-7xl">
          O ÁLBUM <span style={{ color: "white" }}>DA</span> HISTÓRIA
        </h2>
        <p className="mt-3 max-w-xl text-sm text-white/75 md:text-base">
          Role para abrir cada pacotinho, edição por edição, até 1930→2026.
        </p>
      </div>

      {/* SCROLL HINT */}
      <div className="pointer-events-none absolute bottom-6 right-8 z-20 flex items-center gap-3 font-condensed text-xs tracking-[0.4em] text-white/70">
        <span>ROLE</span>
        <span className="h-px w-12 bg-white/40" />
        <span>→</span>
      </div>

      {/* TRACK */}
      <div ref={trackRef} className="absolute inset-y-0 left-0 flex h-full items-center will-change-transform" style={{ paddingLeft: "12vw", paddingRight: "12vw" }}>
        {EDITIONS.map((e, i) => (
          <EditionCard key={e.year} edition={e} active={i === active} />
        ))}
      </div>

      {/* BOTTOM PROGRESS */}
      <div className="pointer-events-none absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-2 px-6">
        {EDITIONS.map((e, i) => (
          <div key={e.year} className="flex flex-col items-center gap-1.5">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === active ? 56 : 18,
                backgroundColor: i === active ? "white" : "oklch(1 0 0 / 0.3)",
              }}
            />
            <span className="font-condensed text-[10px] tracking-[0.3em] text-white/50">{e.year}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function EditionCard({ edition, active }: { edition: Edition; active: boolean }) {
  return (
    <div className="relative mx-[6vw] flex shrink-0 items-center gap-12" style={{ width: "min(78vw, 1100px)" }}>
      {/* Pacotinho / envelope */}
      <div className="relative h-[440px] w-[300px] shrink-0">
        <div
          className={`absolute inset-0 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/30 transition-all duration-700 ${active ? "rotate-[-3deg]" : "rotate-[2deg] opacity-90"}`}
          style={{ background: `linear-gradient(160deg, oklch(1 0 0 / 0.18), oklch(1 0 0 / 0.05))`, backdropFilter: "blur(10px)" }}
        >
          <div className="flex h-full flex-col p-5">
            <div className="flex items-center justify-between font-condensed text-[10px] tracking-[0.4em] text-white/80">
              <span>FIFA WORLD CUP</span>
              <img src={`https://flagcdn.com/w40/${edition.flag}.png`} alt="" className="h-4 w-6 rounded-sm ring-1 ring-white/30" />
            </div>
            <div className="mt-6 font-display text-7xl leading-none tracking-tighter text-white">{edition.year}</div>
            <div className="mt-2 font-condensed text-sm tracking-[0.35em] text-white/75">{edition.host}</div>

            <div className="mt-auto space-y-3">
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <div className="font-condensed text-[10px] tracking-[0.3em] text-white/60">CAMPEÃO</div>
                <div className="mt-1 font-display text-2xl text-white">{edition.champion}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-white/10 p-2.5 backdrop-blur">
                  <div className="font-condensed text-[9px] tracking-[0.3em] text-white/55">BOLA</div>
                  <div className="font-display text-sm text-white">{edition.ball}</div>
                </div>
                <div className="rounded-lg bg-white/10 p-2.5 backdrop-blur">
                  <div className="font-condensed text-[9px] tracking-[0.3em] text-white/55">MASCOTE</div>
                  <div className="font-display text-sm text-white truncate">{edition.mascot}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* "rasgo" effect — diagonal highlight */}
        <div className={`pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-700 ${active ? "opacity-100" : "opacity-0"}`} style={{ background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.15) 45%, transparent 60%)" }} />
      </div>

      {/* Stickers fanned out */}
      <div className="relative hidden h-[440px] flex-1 md:block">
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          {edition.stickers.map((s, i) => {
            const offset = i - (edition.stickers.length - 1) / 2;
            return (
              <div
                key={s.label + i}
                className={`absolute left-0 top-0 h-[200px] w-[140px] origin-bottom rounded-xl bg-white p-3 shadow-2xl transition-all duration-700 ease-out`}
                style={{
                  transform: active
                    ? `translate(${offset * 120}px, ${Math.abs(offset) * 14}px) rotate(${offset * 6}deg)`
                    : `translate(0px, 80px) rotate(${offset * 2}deg) scale(0.8)`,
                  opacity: active ? 1 : 0,
                  transitionDelay: active ? `${i * 80}ms` : "0ms",
                  zIndex: 10 + i,
                }}
              >
                <div className="flex h-full flex-col items-center justify-between rounded-lg p-2" style={{ background: `linear-gradient(160deg, ${edition.accent}, oklch(0.2 0.05 250))` }}>
                  <div className="font-condensed text-[8px] tracking-[0.3em] text-white/80">{edition.year}</div>
                  <div className="text-5xl">{s.emoji}</div>
                  <div className="w-full rounded bg-white px-1 py-0.5 text-center">
                    <div className="font-display text-[10px] tracking-wide text-neutral-900">{s.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlight phrase */}
        <div className="absolute bottom-0 right-0 max-w-sm text-right">
          <div className="font-condensed text-[10px] tracking-[0.4em] text-white/60">MOMENTO ETERNO</div>
          <div className="mt-1 font-display text-2xl leading-tight text-white">{edition.highlight}</div>
        </div>
      </div>

      {/* Mobile-only highlight */}
      <div className="md:hidden absolute -bottom-2 left-0 right-0 px-2 text-center">
        <div className="font-display text-base text-white/90">{edition.highlight}</div>
      </div>
    </div>
  );
}
