import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.nameTitle,
    short_name: "Shobhaamma",
    description:
      "A foundation for students without the means to study, and older women without enough care.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4efe6",
    theme_color: "#16283c",
    lang: "en",
  };
}
