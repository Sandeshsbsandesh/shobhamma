import type { Metadata } from "next";
import { AboutView } from "@/components/views/AboutView";
import { metadataFor } from "@/lib/seo";

export const metadata: Metadata = metadataFor("hi", "about");

export default function Page() {
  return <AboutView lang="hi" />;
}
