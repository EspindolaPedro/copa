import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "motion/react";
import bellingham from "@/assets/players/bellingham.png";
import cr7 from "@/assets/players/cr7.png";
import haaland from "@/assets/players/haaland.png";
import mbappe from "@/assets/players/mbappe.png";
import neymar from "@/assets/players/neymar.png";
import pedri from "@/assets/players/pedri.png";

const players = [
  { src: mbappe, name: "MBAPPÉ", country: "FRA", x: "8%", y: "18%", rot: -8, delay: 0.1 },
  { src: bellingham, name: "BELLINGHAM", country: "ENG", x: "22%", y: "55%", rot: 6, delay: 0.25 },
  { src: cr7, name: "RONALDO", country: "POR", x: "70%", y: "12%", rot: 7, delay: 0.4 },
  { src: neymar, name: "NEYMAR", country: "BRA", x: "78%", y: "52%", rot: -5, delay: 0.55 },
  { src: haaland, name: "HAALAND", country: "NOR", x: "5%", y: "70%", rot: 10, delay: 0.7 },
  { src: pedri, name: "PEDRI", country: "ESP", x: "82%", y: "78%", rot: -10, delay: 0.85 },
];

export function HeroAlbum() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title letter stagger
      const letters = titleRef.current?.querySelectorAll(".letter");
      if (letters) {
        gsap.from(letters, {
          y: 200,
          opacity: 0,
          rotateX: -90,
          stagger: 0.04,
          duration: 1.1,
          ease: "expo.out",
          delay: 0.2,
        });
      }

      // Floating cards continuous
      gsap.utils.toArray<HTMLElement>(".player-card").forEach((card, i) => {
        gsap.to(card, {
          y: "+=20",
          duration: 3 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2,
        });
      });

      // Parallax mousemove
      const onMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        gsap.utils.toArray<HTMLElement>(".player-card").forEach((card, i) => {
          const depth = (i % 3) + 1;
          gsap.to(card, { x: x * depth * 15, rotateY: x * 8, duration: 1, ease: "power2.out", overwrite: "auto" });
          gsap.to(card, { y: `+=${y * depth * 5}`, duration: 1, ease: "power2.out", overwrite: false });
        });
      };
      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    });
    return () => ctx.revert();
  }, []);

  const title = "COPA 2026";

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-hero">
      {/* Glow orbs */}
      <motion.div
        className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.62 0.24 25 / 0.4), transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-40 bottom-10 h-[600px] w-[600px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.72 0.22 145 / 0.35), transparent 70%)" }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.85 0.17 90 / 0.25), transparent 70%)" }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top bar */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 flex items-center justify-between px-8 py-6 md:px-16"
      >
        <div className="font-condensed text-2xl tracking-widest text-foreground">
          PANINI <span className="text-[oklch(0.85_0.17_90)]">★</span> ALBUM
        </div>
        <div className="hidden gap-8 font-condensed text-sm tracking-[0.3em] text-foreground/70 md:flex">
          <span>STICKERS</span>
          <span>TEAMS</span>
          <span>STORE</span>
        </div>
        <button className="rounded-full bg-[oklch(0.85_0.17_90)] px-6 py-2 font-condensed tracking-widest text-[oklch(0.18_0.08_270)] shadow-glow transition-transform hover:scale-105">
          COLETAR
        </button>
      </motion.div>

      {/* Player cards layer */}
      <div ref={cardsRef} className="absolute inset-0 z-10">
        {players.map((p) => (
          <motion.div
            key={p.name}
            className="player-card absolute w-[140px] md:w-[180px]"
            style={{ left: p.x, top: p.y, rotate: `${p.rot}deg` }}
            initial={{ opacity: 0, scale: 0.3, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: p.delay, duration: 0.9, type: "spring", stiffness: 90, damping: 14 }}
            whileHover={{ scale: 1.1, rotate: 0, zIndex: 30, transition: { duration: 0.3 } }}
          >
            <div className="rounded-2xl bg-gradient-to-br from-white/20 to-white/5 p-2 shadow-2xl backdrop-blur-md ring-1 ring-white/20">
              <img src={p.src} alt={p.name} className="w-full rounded-xl" draggable={false} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Center content */}
      <div className="relative z-20 mx-auto flex min-h-[calc(100vh-100px)] max-w-7xl flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-2 backdrop-blur-md"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-[oklch(0.72_0.22_145)]" />
          <span className="font-condensed text-sm tracking-[0.3em] text-foreground/80">
            EDIÇÃO OFICIAL · USA · CAN · MEX
          </span>
        </motion.div>

        <h1
          ref={titleRef}
          className="font-display text-[clamp(4rem,15vw,12rem)] leading-[0.85] tracking-tighter"
          style={{ perspective: "1000px" }}
        >
          {title.split("").map((ch, i) => (
            <span
              key={i}
              className={`letter inline-block ${ch === " " ? "w-[0.3em]" : ""} ${
                i < 4 ? "text-foreground" : "text-gradient-wc"
              }`}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-8 max-w-xl text-balance text-base text-foreground/70 md:text-lg"
        >
          O álbum oficial dos craques que vão decidir a maior copa do mundo.
          Colecione, troque e viva cada gol.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <button className="group relative overflow-hidden rounded-full bg-[oklch(0.62_0.24_25)] px-10 py-4 font-condensed text-lg tracking-[0.2em] text-white shadow-glow">
            <span className="relative z-10">ABRIR PACOTINHO</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[oklch(0.85_0.17_90)] to-[oklch(0.62_0.24_25)] transition-transform duration-500 group-hover:translate-x-0" />
          </button>
          <button className="rounded-full border border-white/30 px-10 py-4 font-condensed text-lg tracking-[0.2em] text-foreground backdrop-blur-md transition-colors hover:bg-white/10">
            VER ÁLBUM
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-8 md:gap-16"
        >
          {[
            { n: "48", l: "SELEÇÕES" },
            { n: "670+", l: "FIGURINHAS" },
            { n: "16", l: "CIDADES" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-3xl text-gradient-wc md:text-5xl">{s.n}</div>
              <div className="mt-1 font-condensed text-xs tracking-[0.3em] text-foreground/60">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden border-t border-white/10 bg-black/30 py-3 backdrop-blur-md">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap font-condensed text-sm tracking-[0.4em] text-foreground/60"
        >
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 gap-12 px-6">
              {["BRASIL", "ARGENTINA", "FRANÇA", "ALEMANHA", "ESPANHA", "INGLATERRA", "PORTUGAL", "HOLANDA", "CROÁCIA", "NORUEGA", "MÉXICO", "CANADÁ", "USA"].map((c) => (
                <span key={c}>★ {c}</span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
