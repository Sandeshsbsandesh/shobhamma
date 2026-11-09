import type { Metadata } from "next";
import { ActivityView } from "@/components/views/ActivityView";
import { metadataFor } from "@/lib/seo";

export const metadata: Metadata = metadataFor("en", "announcements");

export default function Page() {
  return <ActivityView lang="en" page="announcements" />;
}
