import { redirect, notFound } from "next/navigation";
import { getModule, MODULES } from "@/lib/modules";

export function generateStaticParams() {
  return MODULES.map((m) => ({ slug: m.id }));
}

export default function ModuleHubPage({ params }: { params: { slug: string } }) {
  const mod = getModule(params.slug);
  if (!mod) notFound();
  // Old app.html behavior: a bare #module-N hash falls back to the first
  // section in the manifest (always 'notes'). Redirect does the same here.
  redirect(`/modules/${params.slug}/${mod.sections[0].type}`);
}
