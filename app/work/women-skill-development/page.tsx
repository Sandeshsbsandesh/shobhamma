import type { Metadata } from "next";
import { ProgramView } from "@/components/views/ProgramView";
import { metadataFor } from "@/lib/seo";

export const metadata: Metadata = metadataFor("en", "womenSkills");

export default function Page() {
  return <ProgramView lang="en" program="womenSkills" />;
}
