import { createFileRoute } from "@tanstack/react-router";
import { HeroAlbum } from "@/components/HeroAlbum";
import { PlayerShowcase } from "@/components/PlayerShowcase";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Álbum Copa 2026 — Edição Oficial" },
      { name: "description", content: "O álbum oficial da Copa 2026. Colecione os craques que vão decidir o mundial." },
    ],
  }),
});

function Index() {
  return (
    <>
      <HeroAlbum />
      <PlayerShowcase />
    </>
  );
}
