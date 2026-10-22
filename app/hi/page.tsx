import type { Metadata } from "next";
import { HomeView } from "@/components/views/HomeView";
import { metadataFor } from "@/lib/seo";

export const metadata: Metadata = metadataFor("hi", "home");

export default function Page() {
  return <HomeView lang="hi" />;
}
