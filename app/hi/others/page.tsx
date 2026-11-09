import type { Metadata } from "next";
import { ActivityView } from "@/components/views/ActivityView";
import { metadataFor } from "@/lib/seo";

export const metadata: Metadata = metadataFor("hi", "others");

export default function Page() {
  return <ActivityView lang="hi" page="others" />;
}
