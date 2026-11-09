import type { Metadata } from "next";
import { ActivityView } from "@/components/views/ActivityView";
import { metadataFor } from "@/lib/seo";

export const metadata: Metadata = metadataFor("hi", "media");

export default function Page() {
  return <ActivityView lang="hi" page="media" />;
}
