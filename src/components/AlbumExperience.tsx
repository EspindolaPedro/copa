import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Galaxy from "@/components/Galaxy";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import bellingham from "@/assets/players/bellingham.png";
import cr7 from "@/assets/players/cr7.png";
import haaland from "@/assets/players/haaland.png";
import mbappe from "@/assets/players/mbappe.png";
import neymar from "@/assets/players/neymar.png";
import pedri from "@/assets/players/pedri.png";
import paniniLogo from "@/assets/panini-logo.png";
import paniniPattern from "@/assets/panini-pattern.png";

gsap.registerPlugin(ScrollTrigger);

type Player = {
  src: string; name: string; country: string; flag: string; number: string;
  position: string; club: string; bg: string;
  stats: { goals: string; matches: string; assists: string };
  bio: string;
};

const players: Player[] = [
  { src: mbappe, name: "MBAPPÉ", country: "FRANÇA", flag: "🇫🇷", number: "10", position: "ATACANTE", club: "Real Madrid", bg: "oklch(0.42 0.18 250)", stats: { goals: "256", matches: "312", assists: "108" }, bio: "Velocidade fora do comum e finalização cirúrgica. Capitão da França." },
  { src: bellingham, name: "BELLINGHAM", country: "INGLATERRA", flag: "🇬🇧", number: "5", position: "MEIA", club: "Real Madrid", bg: "oklch(0.55 0.18 240)", stats: { goals: "72", matches: "198", assists: "54" }, bio: "Maestro inglês com presença de área. A nova cara do meio-campo europeu." },
  { src: cr7, name: "RONALDO", country: "PORTUGAL", flag: "🇵🇹", number: "7", position: "ATACANTE", club: "Al-Nassr", bg: "oklch(0.45 0.16 30)", stats: { goals: "924", matches: "1247", assists: "278" }, bio: "Recordista absoluto e ainda decisivo no maior palco do mundo." },
  { src: neymar, name: "NEYMAR", country: "BRASIL", flag: "🇧🇷", number: "10", position: "ATACANTE", club: "Santos", bg: "oklch(0.62 0.18 145)", stats: { goals: "438", matches: "712", assists: "267" }, bio: "Magia brasileira em forma de drible. A esperança da seleção." },
  { src: haaland, name: "HAALAND", country: "NORUEGA", flag: "🇳🇴", number: "9", position: "ATACANTE", club: "Manchester City", bg: "oklch(0.58 0.22 25)", stats: { goals: "312", matches: "287", assists: "62" }, bio: "Máquina de gols nórdica. Físico monstruoso e instinto de finalizador." },
  { src: pedri, name: "PEDRI", country: "ESPANHA", flag: "🇪🇸", number: "8", position: "MEIA", club: "Barcelona", bg: "oklch(0.50 0.20 30)", stats: { goals: "38", matches: "215", assists: "47" }, bio: "Tiki-taka encarnado. Visão de jogo de outro planeta." },
];

const RED = "oklch(0.64 0.23 25)";

const SCATTER = [
  { x: 0.04, y: 0.16, rot: -8 },
  { x: 0.20, y: 0.58, rot: 6 },
  { x: 0.74, y: 0.10, rot: 7 },
  { x: 0.78, y: 0.52, rot: -5 },
  { x: 0.04, y: 0.72, rot: 10 },
  { x: 0.62, y: 0.74, rot: -10 },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const HISTORY: Record<string, { year: string; event: string }[]> = {
  MBAPPÉ: [{ year: "2018", event: "Campeão Mundial" }, { year: "2022", event: "Bola de Ouro Copa" }, { year: "2024", event: "Real Madrid" }],
  BELLINGHAM: [{ year: "2020", event: "Borussia Dortmund" }, { year: "2023", event: "Real Madrid" }, { year: "2024", event: "Eurocopa Vice" }],
  RONALDO: [{ year: "2003", event: "Manchester United" }, { year: "2016", event: "Eurocopa Campeão" }, { year: "2024", event: "5x Bola de Ouro" }],
  NEYMAR: [{ year: "2013", event: "Barcelona" }, { year: "2017", event: "PSG recorde" }, { year: "2025", event: "Volta ao Santos" }],
  HAALAND: [{ year: "2020", event: "Borussia Dortmund" }, { year: "2022", event: "Manchester City" }, { year: "2023", event: "Tríplice Coroa" }],
  PEDRI: [{ year: "2020", event: "Estreia Barcelona" }, { year: "2021", event: "Golden Boy" }, { year: "2024", event: "Eurocopa Campeão" }],
};

export function AlbumExperience() {
  const heroRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const cardsLayerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const N = players.length;
      const W = () => window.innerWidth;
      const H = () => window.innerHeight;

      // Title letters
      const letters = titleRef.current?.querySelectorAll(".letter");
      if (letters) {
        gsap.from(letters, { y: 200, opacity: 0, rotateX: -90, stagger: 0.04, duration: 1.1, ease: "expo.out", delay: 2.9 });
      }

      // Final scatter setter
      const setScatter = () => {
        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          gsap.set(card, {
            x: SCATTER[i].x * W(),
            y: SCATTER[i].y * H(),
            rotation: SCATTER[i].rot,
            scale: 1,
            zIndex: 30 + i,
          });
        });
      };

      // Stack target during loading (centered fan)
      const stackPos = (i: number) => {
        const cardW = W() < 640 ? 128 : W() < 768 ? 164 : 220;
        const cardH = W() < 640 ? 180 : W() < 768 ? 230 : 310;
        const cx = W() / 2 - cardW / 2;
        const cy = H() / 2 - cardH / 2 + 40;
        const offset = (i - (N - 1) / 2) * (cardW * 0.55);
        return { x: cx + offset, y: cy, rot: (i - (N - 1) / 2) * 6 };
      };

      // Phase 1 — cards rise from below, centered, into a stacked fan
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const target = stackPos(i);
        gsap.set(card, {
          x: target.x,
          y: H() + 300,
          rotation: target.rot * 0.4,
          scale: 0.9,
          opacity: 0,
          zIndex: 30 + i,
        });
        gsap.to(card, {
          x: target.x,
          y: target.y,
          rotation: target.rot,
          scale: 1,
          opacity: 1,
          duration: 1.0,
          ease: "expo.out",
          delay: 0.15 + i * 0.09,
        });
      });

      // Phase 2 — overlay slides up like a frame; cards scatter to final positions
      const tl = gsap.timeline({ delay: 1.6 });
      tl.to(overlayRef.current, {
        yPercent: -100,
        duration: 0.6,
        ease: "expo.inOut",
        onComplete: () => { setLoading(false); scatterReady = true; },
      }, 0);
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        tl.to(card, {
          x: SCATTER[i].x * W(),
          y: SCATTER[i].y * H(),
          rotation: SCATTER[i].rot,
          scale: 1,
          duration: 0.75,
          ease: "expo.out",
        }, 0.1 + i * 0.035);
      });

      // Continuous floating animation (only while in hero)
      const floatTweens: gsap.core.Tween[] = [];
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const baseY = SCATTER[i].y * H();
        const baseRot = SCATTER[i].rot;
        const tween = gsap.to(card, {
          y: baseY - (10 + (i % 3) * 6),
          rotation: baseRot + (i % 2 === 0 ? 3 : -3),
          duration: 2.6 + (i % 3) * 0.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.4 + i * 0.12,
        });
        floatTweens.push(tween);
      });


      // Mouse parallax (only when in hero)
      let inHero = true;
      const onMove = (e: MouseEvent) => {
        if (!inHero) return;
        const x = (e.clientX / W() - 0.5) * 2;
        const y = (e.clientY / H() - 0.5) * 2;
        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          const depth = (i % 3) + 1;
          gsap.to(card, {
            x: SCATTER[i].x * W() + x * depth * 12,
            y: SCATTER[i].y * H() + y * depth * 8,
            duration: 0.8, ease: "power2.out", overwrite: "auto",
          });
        });
      };
      window.addEventListener("mousemove", onMove);

      // ScrollTrigger: when leaving hero, disable parallax
      ScrollTrigger.create({
        trigger: heroRef.current!,
        start: "bottom 80%",
        onEnter: () => { inHero = false; floatTweens.forEach(t => t.pause()); },
        onLeaveBack: () => { inHero = true; floatTweens.forEach(t => t.resume()); },
      });

      // Pin showcase + drive stacking + cycling
      const stackTarget = (order: number) => {
        const baseX = W() * 0.06;
        const baseY = H() * 0.5 - 310 / 2;
        return {
          x: baseX - order * 16,
          y: baseY + order * 12,
          rot: -2 - order * 1.5,
          scale: 1 - order * 0.05,
        };
      };

      let scatterReady = false;
      ScrollTrigger.create({
        trigger: showcaseRef.current!,
        start: "top top",
        end: () => `+=${H() * (N + 1)}`,
        pin: true,
        scrub: 0.6,
        snap: {
          snapTo: (v) => Math.round(v * (N + 1)) / (N + 1),
          duration: { min: 0.2, max: 0.5 },
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          if (!scatterReady) return;
          const total = N + 1;
          const p = self.progress * total;
          const stackP = Math.min(1, p);
          const cycleIdx = Math.max(0, Math.min(N - 1, Math.floor(p - 1) + 1));
          const idxClamped = Math.max(0, Math.min(N - 1, cycleIdx));

          cardsRef.current.forEach((card, i) => {
            if (!card) return;
            const order = (i - idxClamped + N) % N;
            const tgt = stackTarget(order);
            const sx = SCATTER[i].x * W();
            const sy = SCATTER[i].y * H();
            const x = lerp(sx, tgt.x, stackP);
            const y = lerp(sy, tgt.y, stackP);
            const rot = lerp(SCATTER[i].rot, tgt.rot, stackP);
            const scale = lerp(1, tgt.scale, stackP);
            gsap.to(card, {
              x, y, rotation: rot, scale,
              zIndex: 100 - order,
              duration: 0.4, ease: "power3.out", overwrite: "auto",
            });
          });

          if (idxClamped !== activeRef.current && stackP >= 0.95) {
            activeRef.current = idxClamped;
            setActive(idxClamped);
          }
        },
      });

      // Resize handling
      const onResize = () => { if (inHero) setScatter(); ScrollTrigger.refresh(); };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize", onResize);
      };
    });
    return () => ctx.revert();
  }, []);

  const player = players[active];
  const title = "COPA 2026";

  return (
    <>
      {/* LOADING OVERLAY — slides up like a frame */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[55] flex flex-col items-center justify-start pt-[14vh]"
        style={{
          backgroundColor: "#1f5a3a",
          backgroundImage:
            "linear-gradient(180deg, #1f5a3a 0%, #194a30 100%)",
          willChange: "transform",
        }}
        aria-hidden={!loading}
      >
        {/* Decorative side patterns (Panini confetti) */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-[14%] sm:w-[12%] md:w-[10%]"
          style={{
            backgroundImage: `url(${paniniPattern})`,
            backgroundRepeat: "repeat-y",
            backgroundSize: "100% auto",
            backgroundPosition: "left top",
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-[14%] sm:w-[12%] md:w-[10%]"
          style={{
            backgroundImage: `url(${paniniPattern})`,
            backgroundRepeat: "repeat-y",
            backgroundSize: "100% auto",
            backgroundPosition: "right top",
            transform: "scaleX(-1)",
          }}
        />

        <img src={paniniLogo} alt="Panini" className="relative z-10 h-10 w-auto sm:h-12" />
        <div
          className="relative z-10 mt-10 h-2.5 w-[260px] overflow-hidden rounded-full sm:w-[360px]"
          style={{
            background: "rgba(0,0,0,0.28)",
            boxShadow:
              "inset 0 1px 2px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="relative h-full rounded-full"
            style={{
              animation: "paniniLoad 2.6s cubic-bezier(.4,0,.2,1) forwards",
              background:
                "linear-gradient(90deg, #fbbf24 0%, #ef4444 40%, #3b82f6 75%, #10b981 100%)",
              boxShadow:
                "0 0 12px rgba(255,255,255,0.55), 0 0 24px rgba(251,191,36,0.4), inset 0 1px 0 rgba(255,255,255,0.6)",
            }}
          >
            <span
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
                animation: "paniniShimmer 1.2s linear infinite",
              }}
            />
          </div>
        </div>
        <style>{`
          @keyframes paniniLoad{0%{width:0%}60%{width:75%}100%{width:100%}}
          @keyframes paniniShimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        `}</style>
      </div>

      {/* FIXED CARDS LAYER */}
      <div ref={cardsLayerRef} className={`pointer-events-none fixed inset-0 ${loading ? "z-[60]" : "z-30"}`}>
        {players.map((p, i) => (
          <div
            key={p.name}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="absolute left-0 top-0 h-[180px] w-[128px] overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/20 sm:h-[230px] sm:w-[164px] md:h-[310px] md:w-[220px] md:rounded-2xl"
            style={{
              background: "linear-gradient(160deg, oklch(1 0 0 / 0.18), oklch(1 0 0 / 0.04))",
              backdropFilter: "blur(8px)",
              willChange: "transform",
            }}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between px-4 pt-3 font-condensed text-[10px] tracking-[0.3em] text-white/85">
                <span>FIFA 2026</span>
                <span className="text-xl">{p.flag}</span>
              </div>
              <div className="flex flex-1 items-end justify-center">
                <img src={p.src} alt={p.name} className="h-full w-full object-contain" draggable={false} />
              </div>
              <div className="m-3 rounded-lg bg-white px-3 py-1.5 text-center">
                <div className="font-display text-base tracking-wide text-neutral-900">{p.name}</div>
                <div className="font-condensed text-[9px] tracking-[0.3em] text-neutral-500">{p.country}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* STICKY NAV */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-900/10 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
          <a href="#" className="flex items-center">
            <img src={paniniLogo} alt="Panini" className="h-8 w-auto" />
          </a>
          <nav className="hidden items-center gap-10 md:flex">
            <a href="#" className="font-sans text-sm font-medium text-neutral-800 transition-colors hover:text-neutral-500">Figurinhas</a>
            <a href="#" className="font-sans text-sm font-medium text-neutral-800 transition-colors hover:text-neutral-500">Seleções</a>
            <a href="#" className="font-sans text-sm font-medium text-neutral-800 transition-colors hover:text-neutral-500">Trocas</a>
            <a href="#" className="font-sans text-sm font-medium text-neutral-800 transition-colors hover:text-neutral-500">Loja</a>
          </nav>
          <button className="rounded-full px-5 py-2 font-sans text-sm font-semibold text-white shadow-md transition-transform hover:scale-105" style={{ backgroundColor: RED }}>
            Coletar
          </button>
        </div>
      </header>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen w-full overflow-hidden pt-16" style={{ backgroundColor: "oklch(0.98 0.005 90)" }}>
        {/* Galaxy background — inverted to render on white */}
        <div className="absolute inset-0" style={{ filter: "invert(1) hue-rotate(180deg) opacity(0.45) brightness(1.4)" }}>
          <Galaxy
            mouseInteraction={false}
            mouseRepulsion={false}
            density={1}
            glowIntensity={0.4}
            saturation={0}
            hueShift={140}
            twinkleIntensity={0.3}
            rotationSpeed={0.1}
            repulsionStrength={2}
            autoCenterRepulsion={0}
            starSpeed={0.5}
            speed={1}
          />
        </div>

        {/* Soft white vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, oklch(1 0 0 / 0.55) 0%, transparent 70%)" }}
        />


        <div className="relative z-20 mx-auto flex min-h-[calc(100vh-100px)] max-w-7xl flex-col items-center justify-center px-6 text-center">
          <h1 ref={titleRef} className="font-display text-[clamp(4rem,15vw,12rem)] leading-[0.85] tracking-tighter text-neutral-900" style={{ perspective: "1000px" }}>
            {title.split("").map((ch, i) => (
              <span key={i} className={`letter inline-block ${ch === " " ? "w-[0.3em]" : ""}`} style={i >= 5 ? { color: RED } : undefined}>
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8 }} className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-neutral-700 sm:mt-8 sm:text-lg md:text-xl">
            <span className="font-display text-neutral-900">670 figurinhas.</span> 48 seleções.
            Uma copa que vai entrar pra história. O álbum que vai contar tudo.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.8 }} className="mt-10 flex justify-center sm:mt-12">
            <button
              className="group relative inline-flex items-center gap-4 rounded-full p-1.5 pr-2 font-condensed text-base tracking-[0.28em] text-white transition-all duration-500 hover:gap-6 sm:text-lg"
              style={{
                backgroundImage: `linear-gradient(135deg, ${RED} 0%, #b91c1c 50%, ${RED} 100%)`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.25), 0 0 0 1px rgba(255,255,255,0.1)`,
              }}
            >
              {/* Animated gradient ring */}
              <span
                className="pointer-events-none absolute -inset-px rounded-full opacity-70 blur-[2px] transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  backgroundImage: `conic-gradient(from 0deg, #fff, #fbbf24, #fff, #fca5a5, #fff)`,
                  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  padding: "1.5px",
                  animation: "spin 6s linear infinite",
                }}
              />

              <span className="relative z-10 pl-6 pr-2 sm:pl-8">ABRIR PACOTINHO</span>

              <span
                className="relative z-10 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/50 text-white transition-transform duration-500 group-hover:rotate-[360deg] sm:h-14 sm:w-14"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.05) 100%)",
                  backdropFilter: "blur(12px) saturate(180%)",
                  WebkitBackdropFilter: "blur(12px) saturate(180%)",
                  boxShadow:
                    "inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -1px 2px rgba(255,255,255,0.15), 0 4px 14px rgba(0,0,0,0.2)",
                }}
              >
                <span className="pointer-events-none absolute inset-x-2 top-1 h-1/3 rounded-full bg-white/40 blur-[2px]" />
                <ArrowRight className="relative h-5 w-5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]" strokeWidth={2.5} />
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      <FlagsMarquee />

      {/* SHOWCASE */}
      <section
        ref={showcaseRef}
        className="relative h-screen w-full overflow-hidden"
        style={{ backgroundColor: player.bg, transition: "background-color 0.6s ease" }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

        <div key={player.number + active} className="pointer-events-none absolute right-[5%] top-1/2 -translate-y-1/2 font-display text-[40vw] leading-none text-white/10 select-none" style={{ animation: "fadeIn 0.6s ease" }}>
          {player.number}
        </div>

        <div className="relative z-10 mx-auto grid h-full max-w-[1400px] grid-cols-1 gap-8 px-6 py-24 md:grid-cols-12 md:px-16 md:py-20">
          {/* Left: caption + dots (cards rendered via fixed layer on md+) */}
          <div className="col-span-12 flex flex-col justify-center md:col-span-7">
            <div className="max-w-[360px] md:ml-[300px]">
              <div key={"cap" + active} className="font-condensed text-xs tracking-[0.4em] text-white/70 sm:text-sm" style={{ animation: "fadeIn 0.5s ease" }}>
                #{String(active + 1).padStart(2, "0")} / {String(players.length).padStart(2, "0")}
              </div>
              <h3 key={"name" + active} className="mt-3 font-display text-4xl leading-none tracking-tight text-white sm:text-5xl md:text-6xl" style={{ animation: "fadeIn 0.6s ease" }}>
                {player.name}
              </h3>
              <p key={"bio" + active} className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base" style={{ animation: "fadeIn 0.7s ease" }}>
                {player.bio}
              </p>
            </div>

            <div className="mt-8 flex items-center gap-2 md:ml-[300px] md:mt-12 md:gap-3">
              {players.map((_, i) => (
                <div
                  key={i}
                  className="h-2 rounded-full transition-all duration-500 md:h-2.5"
                  style={{
                    width: i === active ? 48 : 20,
                    backgroundColor: i === active ? RED : "oklch(1 0 0 / 0.25)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right: history panel */}
          <div className="col-span-12 flex flex-col justify-center md:col-span-5">
            <div key={"panel" + active} className="rounded-3xl border border-white/15 bg-black/30 p-5 backdrop-blur-md sm:p-8" style={{ animation: "fadeIn 0.6s ease" }}>
              <div className="font-condensed text-xs tracking-[0.4em] text-white/60">FICHA DO JOGADOR</div>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-display text-5xl text-white sm:text-6xl">{player.number}</span>
                <span className="font-condensed text-base tracking-[0.3em] text-white/80 sm:text-xl">{player.position}</span>
              </div>

              <div className="mt-6 space-y-2 border-t border-white/15 pt-6">
                <Row label="País" value={`${player.flag}  ${player.country}`} />
                <Row label="Clube" value={player.club} />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/15 pt-6">
                <Stat label="GOLS" value={player.stats.goals} />
                <Stat label="JOGOS" value={player.stats.matches} />
                <Stat label="ASSIST" value={player.stats.assists} />
              </div>

              <div className="mt-8 font-condensed text-xs tracking-[0.4em] text-white/50">HISTÓRICO</div>
              <div className="mt-3 space-y-1.5 text-sm text-white/85">
                {(HISTORY[player.name] ?? []).map((h) => (
                  <div key={h.year} className="flex justify-between border-b border-white/10 py-1.5">
                    <span className="font-condensed tracking-[0.2em] text-white/60">{h.year}</span>
                    <span>{h.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      </section>
    </>
  );
}

const WC_FLAGS: { code: string; n: string }[] = [
  { code: "ar", n: "ARGENTINA" }, { code: "au", n: "AUSTRÁLIA" }, { code: "at", n: "ÁUSTRIA" },
  { code: "be", n: "BÉLGICA" }, { code: "br", n: "BRASIL" }, { code: "ca", n: "CANADÁ" },
  { code: "co", n: "COLÔMBIA" }, { code: "kr", n: "COREIA DO SUL" }, { code: "ci", n: "COSTA DO MARFIM" },
  { code: "hr", n: "CROÁCIA" }, { code: "dk", n: "DINAMARCA" }, { code: "ec", n: "EQUADOR" },
  { code: "eg", n: "EGITO" }, { code: "es", n: "ESPANHA" }, { code: "us", n: "EUA" },
  { code: "fr", n: "FRANÇA" }, { code: "gh", n: "GANA" }, { code: "nl", n: "HOLANDA" },
  { code: "ir", n: "IRÃ" }, { code: "gb", n: "INGLATERRA" }, { code: "jp", n: "JAPÃO" },
  { code: "jo", n: "JORDÂNIA" }, { code: "ma", n: "MARROCOS" }, { code: "mx", n: "MÉXICO" },
  { code: "nz", n: "NOVA ZELÂNDIA" }, { code: "no", n: "NORUEGA" }, { code: "py", n: "PARAGUAI" },
  { code: "pt", n: "PORTUGAL" }, { code: "qa", n: "CATAR" }, { code: "sn", n: "SENEGAL" },
  { code: "rs", n: "SÉRVIA" }, { code: "ch", n: "SUÍÇA" }, { code: "tn", n: "TUNÍSIA" },
  { code: "tr", n: "TURQUIA" }, { code: "uz", n: "UZBEQUISTÃO" }, { code: "uy", n: "URUGUAI" },
  { code: "dz", n: "ARGÉLIA" }, { code: "de", n: "ALEMANHA" }, { code: "it", n: "ITÁLIA" },
  { code: "cl", n: "CHILE" }, { code: "pe", n: "PERU" }, { code: "ng", n: "NIGÉRIA" },
  { code: "cm", n: "CAMARÕES" }, { code: "sa", n: "ARÁBIA SAUDITA" }, { code: "pl", n: "POLÔNIA" },
  { code: "ua", n: "UCRÂNIA" },
];

function FlagsMarquee() {
  const loop = [...WC_FLAGS, ...WC_FLAGS];
  return (
    <section className="relative w-full overflow-hidden border-y border-neutral-200 bg-white py-8">
      <div className="flex whitespace-nowrap" style={{ animation: "flagscroll 90s linear infinite", width: "max-content" }}>
        {loop.map((f, i) => (
          <div key={i} className="flex items-center gap-4 pr-12">
            <img
              src={`https://flagcdn.com/w80/${f.code}.png`}
              srcSet={`https://flagcdn.com/w160/${f.code}.png 2x`}
              alt={f.n}
              className="h-9 w-14 rounded-sm object-cover shadow-sm ring-1 ring-black/10"
              loading="lazy"
              draggable={false}
            />
            <span className="font-condensed text-sm tracking-[0.35em] text-neutral-800">{f.n}</span>
            <span className="pl-8" style={{ color: RED }}>★</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes flagscroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
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
