import type { Metadata } from "next";
import { ActivitiesHubView } from "@/components/views/ActivityView";
import { metadataFor } from "@/lib/seo";

export const metadata: Metadata = metadataFor("hi", "activities");

export default function Page() {
  return <ActivitiesHubView lang="hi" />;
}
