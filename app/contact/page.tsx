import type { Metadata } from "next";
import { ContactView } from "@/components/views/ContactView";
import { metadataFor } from "@/lib/seo";

export const metadata: Metadata = metadataFor("en", "contact");

export default function Page() {
  return <ContactView lang="en" />;
}
