import type { Metadata } from "next";
import { SupportView } from "@/components/views/SupportView";
import { metadataFor } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = metadataFor("hi", "support");

export default function Page() {
  return <SupportView lang="hi" />;
}
