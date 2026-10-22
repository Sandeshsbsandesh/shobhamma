import type { Metadata } from "next";
import { WorkView } from "@/components/views/WorkView";
import { metadataFor } from "@/lib/seo";

export const metadata: Metadata = metadataFor("en", "work");

export default function Page() {
  return <WorkView lang="en" />;
}
