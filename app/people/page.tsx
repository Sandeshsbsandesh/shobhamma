import type { Metadata } from "next";
import { PeopleView } from "@/components/views/PeopleView";
import { metadataFor } from "@/lib/seo";

export const metadata: Metadata = metadataFor("en", "people");

export default function Page() {
  return <PeopleView lang="en" />;
}
