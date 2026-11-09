import type { Metadata } from "next";
import { ProgramView } from "@/components/views/ProgramView";
import { metadataFor } from "@/lib/seo";

export const metadata: Metadata = metadataFor("hi", "environment");

export default function Page() {
  return <ProgramView lang="hi" program="environment" />;
}
