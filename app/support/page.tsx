import type { Metadata } from "next";
import { SupportView } from "@/components/views/SupportView";
import { metadataFor } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = metadataFor("en", "support");

export default function Page() {
  return <SupportView lang="en" />;
}
