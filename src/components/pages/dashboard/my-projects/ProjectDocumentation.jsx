"use client";

import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import { BookOpenText, ChevronDown, FileX, LayoutGrid } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import EmptyState from "@/components/common/EmptyState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AttachmentList from "@/components/common/AttachmentList";
import { cn } from "@/lib/utils";
import { BLOCKS, ListBlock } from "./DocContentBlocks";

export default function ProjectDocumentation({ project }) {
  const doc = project?.documentation;
  const sections = doc?.sections ?? [];
  const mentor = project?.mentorInfo;

  const [activeId, setActiveId] = useState(sections[0]?.id ?? null);
  const scrollRef = useRef(null);
  const sectionRefs = useRef({});
  const chipsRef = useRef(null);
  const chipRefs = useRef({});

  // Reset to the top whenever a different project is selected.
  useEffect(() => {
    setActiveId(sections[0]?.id ?? null);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  // Keep the active chip visible in the horizontally scrolling tab row.
  useEffect(() => {
    const row = chipsRef.current;
    const chip = chipRefs.current[activeId];
    if (!row || !chip || row.offsetWidth === 0) return;
    row.scrollTo({
      left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [activeId]);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || !sections.length) return;

    const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 4;
    if (atBottom) {
      setActiveId(sections[sections.length - 1].id);
      return;
    }

    let current = sections[0].id;
    for (const section of sections) {
      const el = sectionRefs.current[section.id];
      if (el && el.offsetTop - 24 <= container.scrollTop) current = section.id;
    }
    setActiveId(current);
  }, [sections]);

  const goTo = (id) => {
    const container = scrollRef.current;
    const el = sectionRefs.current[id];
    if (!container || !el) return;
    setActiveId(id);
    container.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
  };

  return (
    <SectionCard
      icon={BookOpenText}
      title="Project Documentation"
      description={
        doc ? `${project.name} • Shared by ${mentor?.name ?? "your mentor"}` : project?.name
      }
      iconClassName="bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400"
      action={
        doc ? (
          <div className="flex items-center gap-2">
            <span className="hidden text-[10.5px] text-slate-400 dark:text-slate-500 sm:inline">
              {doc.updatedLabel}
            </span>
            <span className="rounded-full bg-primary-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
              {doc.version}
            </span>
          </div>
        ) : null
      }
      contentClassName="p-0"
    >
      {!sections.length ? (
        <div className="p-5">
          <EmptyState
            icon={FileX}
            title="No documentation shared yet"
            description="Your mentor will add requirements and specs for this project here."
          />
        </div>
      ) : (
        <div className="@container">
          {/* Section dropdown + horizontal section tabs */}
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5 dark:border-slate-800 sm:px-5">
            <nav
              ref={chipsRef}
              aria-label="Documentation sections"
              className="relative flex min-w-0 flex-1 gap-1.5 overflow-x-auto"
            >
              {sections.map((section) => (
                <Button variant="unstyled"
                  key={section.id}
                  type="button"
                  ref={(el) => {
                    chipRefs.current[section.id] = el;
                  }}
                  onClick={() => goTo(section.id)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
                    activeId === section.id
                      ? "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400"
                      : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
                  )}
                >
                  {section.title}
                </Button>
              ))}
            </nav>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="unstyled"
                    type="button"
                    aria-label="Browse all sections"
                    className="group flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  />
                }
              >
                <LayoutGrid
                  className="h-3.5 w-3.5 text-primary-500 dark:text-primary-400"
                  aria-hidden="true"
                />
                All sections
                <span className="rounded-full bg-slate-100 px-1.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {sections.length}
                </span>
                <ChevronDown
                  className="h-3.5 w-3.5 text-slate-400 transition-transform group-data-[popup-open]:rotate-180"
                  aria-hidden="true"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={6}
                className="p-2"
                style={{ width: "min(36rem, calc(100vw - 2rem))" }}
              >
                <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                  Jump to section
                </p>
                <div className="grid grid-cols-3 gap-1">
                  {sections.map((section, index) => {
                    const active = activeId === section.id;
                    return (
                      <DropdownMenuItem
                        key={section.id}
                        onClick={() => goTo(section.id)}
                        className={cn(
                          "items-start gap-2 rounded-lg px-2 py-1.5 text-[11px] leading-snug",
                          active
                            ? "bg-primary-50 font-semibold text-primary-600 dark:bg-primary-500/10 dark:text-primary-400"
                            : "text-slate-600 dark:text-slate-300",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="mt-px shrink-0 font-mono text-[9.5px] text-slate-400 dark:text-slate-500"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="line-clamp-2 min-w-0">{section.title}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Documentation content */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="relative max-h-[590px] min-w-0 space-y-3 overflow-y-auto overscroll-contain bg-slate-50/50 p-4 dark:bg-slate-900/20 sm:px-5"
          >
            {sections.map((section) => {
              const Block = BLOCKS[section.type] ?? ListBlock;
              return (
                <section
                  key={section.id}
                  id={`${project.id}-${section.id}`}
                  ref={(el) => {
                    sectionRefs.current[section.id] = el;
                  }}
                  className="rounded-xl border border-slate-200/70 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <h3 className="mb-3 text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
                    {section.title}
                  </h3>
                  {section.content?.length > 0 && <Block content={section.content} />}
                  {section.attachments?.length > 0 && (
                    <AttachmentList items={section.attachments} className={section.content?.length ? "mt-3" : ""} />
                  )}
                  {section.addedBy && (
                    <p className="mt-3 text-[10.5px] text-slate-400 dark:text-slate-500">Shared by {section.addedBy}</p>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
