import type { Metadata } from "next";
import { ContactView } from "@/components/views/ContactView";
import { metadataFor } from "@/lib/seo";

export const metadata: Metadata = metadataFor("hi", "contact");

export default function Page() {
  return <ContactView lang="hi" />;
}
