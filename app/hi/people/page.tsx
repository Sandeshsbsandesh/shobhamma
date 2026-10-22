import type { Metadata } from "next";
import { PeopleView } from "@/components/views/PeopleView";
import { metadataFor } from "@/lib/seo";

export const metadata: Metadata = metadataFor("hi", "people");

export default function Page() {
  return <PeopleView lang="hi" />;
}
