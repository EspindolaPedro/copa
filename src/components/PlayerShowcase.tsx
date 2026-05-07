import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bellingham from "@/assets/players/bellingham.png";
import cr7 from "@/assets/players/cr7.png";
import haaland from "@/assets/players/haaland.png";
import mbappe from "@/assets/players/mbappe.png";
import neymar from "@/assets/players/neymar.png";
import pedri from "@/assets/players/pedri.png";

gsap.registerPlugin(ScrollTrigger);

type Player = {
  src: string;
  name: string;
  country: string;
  flag: string;
  number: string;
  position: string;
  club: string;
  bg: string;
  stats: { goals: string; matches: string; assists: string };
  bio: string;
};

const players: Player[] = [
  {
    src: mbappe, name: "MBAPPÉ", country: "FRANÇA", flag: "🇫🇷", number: "10", position: "ATACANTE",
    club: "Real Madrid", bg: "oklch(0.42 0.18 250)",
    stats: { goals: "256", matches: "312", assists: "108" },
    bio: "Velocidade fora do comum e finalização cirúrgica. Capitão da França e ídolo de uma geração.",
  },
  {
    src: bellingham, name: "BELLINGHAM", country: "INGLATERRA", flag: "🇬🇧", number: "5", position: "MEIA",
    club: "Real Madrid", bg: "oklch(0.55 0.18 240)",
    stats: { goals: "72", matches: "198", assists: "54" },
    bio: "Maestro inglês com presença de área. A nova cara do meio-campo europeu.",
  },
  {
    src: cr7, name: "RONALDO", country: "PORTUGAL", flag: "🇵🇹", number: "7", position: "ATACANTE",
    club: "Al-Nassr", bg: "oklch(0.45 0.16 30)",
    stats: { goals: "924", matches: "1247", assists: "278" },
    bio: "O fenômeno português. Recordista absoluto e ainda decisivo no maior palco do mundo.",
  },
  {
    src: neymar, name: "NEYMAR", country: "BRASIL", flag: "🇧🇷", number: "10", position: "ATACANTE",
    club: "Santos", bg: "oklch(0.62 0.18 145)",
    stats: { goals: "438", matches: "712", assists: "267" },
    bio: "Magia brasileira em forma de drible. O craque que carrega a esperança da seleção.",
  },
  {
    src: haaland, name: "HAALAND", country: "NORUEGA", flag: "🇳🇴", number: "9", position: "ATACANTE",
    club: "Manchester City", bg: "oklch(0.58 0.22 25)",
    stats: { goals: "312", matches: "287", assists: "62" },
    bio: "Máquina de gols nórdica. Físico monstruoso e instinto puro de finalizador.",
  },
  {
    src: pedri, name: "PEDRI", country: "ESPANHA", flag: "🇪🇸", number: "8", position: "MEIA",
    club: "Barcelona", bg: "oklch(0.50 0.20 30)",
    stats: { goals: "38", matches: "215", assists: "47" },
    bio: "Tiki-taka encarnado. Visão de jogo de outro planeta no auge dos seus 23 anos.",
  },
];

const RED = "oklch(0.64 0.23 25)";

export function PlayerShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const total = players.length;
      const st = ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: "top top",
        end: () => `+=${window.innerHeight * total}`,
        pin: true,
        scrub: 0.6,
        snap: {
          snapTo: (v) => Math.round(v * (total - 1)) / (total - 1),
          duration: 0.4,
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const idx = Math.min(total - 1, Math.round(self.progress * (total - 1)));
          setActive(idx);
        },
      });
      return () => st.kill();
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // animate cards positions whenever active changes
  useEffect(() => {
    const cards = trackRef.current?.querySelectorAll<HTMLElement>(".stack-card");
    if (!cards) return;
    const total = players.length;
    cards.forEach((card, i) => {
      // visual order relative to active
      const order = (i - active + total) % total;
      if (order === 0) {
        // featured big card center-left
        gsap.to(card, {
          x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, zIndex: 50,
          duration: 0.8, ease: "expo.out",
        });
      } else {
        // stacked behind on the left
        gsap.to(card, {
          x: -40 - order * 14,
          y: 30 + order * 10,
          scale: 0.78 - order * 0.04,
          rotate: -4 - order * 1.5,
          opacity: order > 4 ? 0 : 0.55 - order * 0.08,
          zIndex: 40 - order,
          duration: 0.7, ease: "expo.out",
        });
      }
    });
  }, [active]);

  const player = players[active];

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: player.bg, transition: "background-color 0.8s ease" }}
    >
      {/* texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* big background number */}
      <div
        key={player.number + active}
        className="pointer-events-none absolute right-[5%] top-1/2 -translate-y-1/2 font-display text-[40vw] leading-none text-white/10 select-none"
        style={{ animation: "fadeIn 0.6s ease" }}
      >
        {player.number}
      </div>

      <div className="relative z-10 mx-auto grid h-full max-w-[1400px] grid-cols-1 gap-8 px-8 py-20 md:grid-cols-12 md:px-16">
        {/* LEFT: Card stack + dots */}
        <div className="relative col-span-7 flex flex-col justify-center">
          <div className="relative h-[480px] w-full">
            <div ref={trackRef} className="absolute left-0 top-0 h-full w-[340px]">
              {players.map((p, i) => (
                <div
                  key={p.name}
                  className="stack-card absolute left-0 top-0 h-[480px] w-[340px] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/20"
                  style={{
                    background:
                      "linear-gradient(160deg, oklch(1 0 0 / 0.18), oklch(1 0 0 / 0.04))",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div className="absolute inset-0 flex flex-col">
                    <div className="flex items-center justify-between px-5 pt-5 font-condensed text-xs tracking-[0.3em] text-white/80">
                      <span>FIFA 2026</span>
                      <span className="text-2xl">{p.flag}</span>
                    </div>
                    <div className="flex flex-1 items-end justify-center">
                      <img src={p.src} alt={p.name} className="h-full w-full object-contain" draggable={false} />
                    </div>
                    <div className="m-4 rounded-xl bg-white px-4 py-2 text-center">
                      <div className="font-display text-xl tracking-wide text-neutral-900">{p.name}</div>
                      <div className="font-condensed text-xs tracking-[0.3em] text-neutral-500">{p.country}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Featured caption */}
            <div className="absolute left-[380px] top-1/2 -translate-y-1/2 max-w-[320px]">
              <div
                key={"cap" + active}
                className="font-condensed text-sm tracking-[0.4em] text-white/70"
                style={{ animation: "fadeIn 0.5s ease" }}
              >
                #{String(active + 1).padStart(2, "0")} / {String(players.length).padStart(2, "0")}
              </div>
              <h3
                key={"name" + active}
                className="mt-3 font-display text-5xl leading-none tracking-tight text-white"
                style={{ animation: "fadeIn 0.6s ease" }}
              >
                {player.name}
              </h3>
              <p
                key={"bio" + active}
                className="mt-4 text-sm leading-relaxed text-white/80"
                style={{ animation: "fadeIn 0.7s ease" }}
              >
                {player.bio}
              </p>
            </div>
          </div>

          {/* Dots */}
          <div className="mt-12 flex items-center gap-3">
            {players.map((_, i) => (
              <div
                key={i}
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: i === active ? 56 : 24,
                  backgroundColor: i === active ? RED : "oklch(1 0 0 / 0.25)",
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: History panel */}
        <div className="relative col-span-5 flex flex-col justify-center">
          <div
            key={"panel" + active}
            className="rounded-3xl border border-white/15 bg-black/25 p-8 backdrop-blur-md"
            style={{ animation: "fadeIn 0.6s ease" }}
          >
            <div className="font-condensed text-xs tracking-[0.4em] text-white/60">FICHA DO JOGADOR</div>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-display text-6xl text-white">{player.number}</span>
              <span className="font-condensed text-xl tracking-[0.3em] text-white/80">{player.position}</span>
            </div>

            <div className="mt-6 space-y-2 border-t border-white/15 pt-6">
              <Row label="País" value={`${player.flag}  ${player.country}`} />
              <Row label="Clube" value={player.club} />
              <Row label="Posição" value={player.position} />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/15 pt-6">
              <Stat label="GOLS" value={player.stats.goals} />
              <Stat label="JOGOS" value={player.stats.matches} />
              <Stat label="ASSIST" value={player.stats.assists} />
            </div>

            <div className="mt-8 font-condensed text-xs tracking-[0.4em] text-white/50">
              HISTÓRICO · CARREIRA OFICIAL
            </div>
            <div className="mt-3 space-y-1.5 text-sm text-white/85">
              {historyFor(player.name).map((h) => (
                <div key={h.year} className="flex justify-between border-b border-white/10 py-1.5">
                  <span className="font-condensed tracking-[0.2em] text-white/60">{h.year}</span>
                  <span>{h.event}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between font-condensed text-xs tracking-[0.4em] text-white/50">
            <span>SCROLL ↓ PARA TROCAR</span>
            <span>{String(active + 1).padStart(2, "0")} / {String(players.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="font-condensed tracking-[0.3em] text-white/55">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-3 text-center">
      <div className="font-display text-2xl text-white">{value}</div>
      <div className="font-condensed text-[10px] tracking-[0.3em] text-white/60">{label}</div>
    </div>
  );
}

function historyFor(name: string) {
  const map: Record<string, { year: string; event: string }[]> = {
    MBAPPÉ: [
      { year: "2018", event: "Campeão Mundial" },
      { year: "2022", event: "Bola de Ouro da Copa" },
      { year: "2024", event: "Real Madrid" },
    ],
    BELLINGHAM: [
      { year: "2020", event: "Borussia Dortmund" },
      { year: "2023", event: "Real Madrid" },
      { year: "2024", event: "Eurocopa Vice" },
    ],
    RONALDO: [
      { year: "2003", event: "Manchester United" },
      { year: "2016", event: "Eurocopa Campeão" },
      { year: "2024", event: "5x Bola de Ouro" },
    ],
    NEYMAR: [
      { year: "2013", event: "Barcelona" },
      { year: "2017", event: "PSG transferência recorde" },
      { year: "2025", event: "Volta ao Santos" },
    ],
    HAALAND: [
      { year: "2020", event: "Borussia Dortmund" },
      { year: "2022", event: "Manchester City" },
      { year: "2023", event: "Tríplice Coroa" },
    ],
    PEDRI: [
      { year: "2020", event: "Estreia Barcelona" },
      { year: "2021", event: "Golden Boy" },
      { year: "2024", event: "Eurocopa Campeão" },
    ],
  };
  return map[name] ?? [];
}
