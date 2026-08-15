"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { MODULES, sectionTypeMeta } from "@/lib/modules";

interface Item {
  label: string;
  desc: string;
  href: string;
  group: string;
}

// Direct port of the searchIndex-building loop in search.js, minus the
// hand-written MODULE_SECTIONS entries (that granularity doesn't exist yet
// for modules 1/3 — add per-topic entries here once those notes exist).
function buildIndex(): Item[] {
  const items: Item[] = [];
  MODULES.forEach((m) => {
    items.push({
      label: m.label,
      desc: m.desc || "هنوز شروع نشده",
      href: `/modules/${m.id}`,
      group: "Module",
    });
    m.sections.forEach((s) => {
      if (s.placeholder) return; // matches old behavior: only complete sections are indexed
      const meta = sectionTypeMeta(s.type);
      items.push({
        label: `${m.label} · ${meta?.labelFa ?? s.type}`,
        desc: meta?.desc ?? "",
        href: `/modules/${m.id}/${s.type}`,
        group: meta?.label ?? s.type,
      });
    });
    if (m.exercises) {
      items.push({
        label: `${m.label} · تمرین‌ها`,
        desc: m.exercises.titles.join("، "),
        href: `/modules/${m.id}/exercises`,
        group: "Exercises",
      });
    }
    if (m.project) {
      items.push({
        label: `${m.label} · پروژه`,
        desc: m.project.summary,
        href: `/modules/${m.id}/project`,
        group: "Project",
      });
    }
  });
  return items;
}

export default function SearchPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const index = useMemo(buildIndex, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.slice(0, 8);
    return index
      .filter((i) => i.label.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q))
      .slice(0, 12);
  }, [query, index]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    function onToggleEvent() {
      setOpen((o) => !o);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("toggle-palette", onToggleEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("toggle-palette", onToggleEvent);
    };
  }, []);

  useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="palette-overlay open"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="palette">
        <div className="palette-head">
          <Search size={16} />
          <input
            autoFocus
            className="palette-input"
            placeholder="Search modules, notes, exercises…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="palette-close" onClick={() => setOpen(false)} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="palette-results">
          {results.length === 0 && <div className="palette-empty">No results found</div>}
          {results.map((r) => (
            <button
              key={r.href}
              className="palette-result"
              onClick={() => {
                setOpen(false);
                router.push(r.href);
              }}
            >
              <span className="pr-label">{r.label}</span>
              <span className="pr-desc">{r.desc}</span>
              <span className="pr-tab">{r.group}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
