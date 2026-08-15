"use client";

import { useEffect, useRef, useState } from "react";

interface TocItem {
  id: string;
  label: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Renders one section's HTML and layers the old site's reading-experience
 * behavior on top of it, ported from reading-progress.js / interactions.js:
 *  - "On this page" TOC built from .section-c h2 (initToc)
 *  - scroll-spy highlighting the active heading (startTocObserver)
 *  - a page reading-progress bar (updatePanelProgress)
 *  - copy buttons for code blocks that don't already have one (initStandaloneCodeCopy)
 *  - a "#" share-link button per heading that copies a deep link (initSectionLinks)
 *
 * The old version did this across a whole tab-panel inside a single-page app
 * with hash routing; here each section is already its own route, so there's
 * no tab-switching/hash-parsing logic to port — only the in-page behavior.
 */
export default function ContentInteractions({ html }: { html: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const headings = Array.from(root.querySelectorAll<HTMLHeadingElement>(".section-c h2"));
    const items: TocItem[] = headings.map((h, i) => {
      if (!h.id) h.id = `${slugify(h.textContent || "section")}-${i}`;
      return { id: h.id, label: h.textContent?.trim() || "" };
    });
    setToc(items);

    headings.forEach((h) => {
      if (h.querySelector(".section-link")) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "section-link";
      btn.setAttribute("aria-label", "Copy link to section");
      btn.textContent = "#";
      h.appendChild(btn);
    });

    root.querySelectorAll<HTMLElement>(".code-block").forEach((block) => {
      if (block.querySelector(".cb-copy-btn")) return;
      const prev = block.previousElementSibling;
      if (prev && prev.classList.contains("code-head")) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn cb-copy-btn";
      btn.setAttribute("aria-label", "Copy code");
      btn.setAttribute("data-copy", block.textContent || "");
      btn.textContent = "⌘";
      block.appendChild(btn);
    });

    function copyText(text: string, btn: HTMLElement, isLink = false) {
      const done = () => {
        btn.classList.add("copied");
        const orig = btn.textContent;
        if (isLink) btn.setAttribute("aria-label", "Copied!");
        else btn.textContent = "✓";
        setTimeout(() => {
          btn.classList.remove("copied");
          if (isLink) btn.setAttribute("aria-label", "Copy link to section");
          else if (orig) btn.textContent = orig;
        }, 1200);
      };
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
      } else {
        fallbackCopy(text, done);
      }
    }

    function fallbackCopy(text: string, done: () => void) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        done();
      } catch {
        /* no-op — clipboard unavailable */
      }
      document.body.removeChild(ta);
    }

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const copyBtn = target.closest<HTMLElement>(".copy-btn");
      if (copyBtn) {
        const text = copyBtn.getAttribute("data-copy");
        if (text) copyText(text, copyBtn);
        return;
      }
      const linkBtn = target.closest<HTMLElement>(".section-link");
      if (linkBtn) {
        const h = linkBtn.closest("h2");
        if (!h || !h.id) return;
        const url = `${location.origin}${location.pathname}#${h.id}`;
        copyText(url, linkBtn, true);
      }
    }
    root.addEventListener("click", onClick);

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (!root) {
          ticking = false;
          return;
        }
        const rect = root.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height - vh;
        const pct = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
        setProgress(Math.round(pct * 100));

        let best: HTMLElement | null = null;
        headings.forEach((h) => {
          const r = h.getBoundingClientRect();
          if (r.top <= 120 && (!best || r.top > best.getBoundingClientRect().top)) {
            best = h;
          }
        });
        if (best) setActiveId((best as HTMLElement).id);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      root.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, [html]);

  return (
    <div className="content-interactions">
      {toc.length >= 2 && (
        <nav className="page-toc" aria-label="On this page">
          <span className="toc-label">On this page</span>
          {toc.map((item, i) => (
            <span key={item.id}>
              {i > 0 && <span className="toc-sep">|</span>}
              <a href={`#${item.id}`} className={`toc-link ${activeId === item.id ? "active" : ""}`}>
                {item.label}
              </a>
            </span>
          ))}
        </nav>
      )}

      <div className="reading-progress-bar" aria-hidden="true">
        <div className="rp-fill" style={{ width: `${progress}%` }} />
      </div>

      <div ref={contentRef} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
