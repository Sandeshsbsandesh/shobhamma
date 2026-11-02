import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shobhaamma Charitable Foundation",
    short_name: "Shobhamma",
    description:
      "Shobhaamma Charitable Foundation (Shobhamma, SCF) helps children and students who cannot afford school.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4efe6",
    theme_color: "#16283c",
    lang: "en",
  };
}
