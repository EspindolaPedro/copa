import { createFileRoute } from "@tanstack/react-router";
import { AlbumExperience } from "@/components/AlbumExperience";

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
  return <AlbumExperience />;
}
