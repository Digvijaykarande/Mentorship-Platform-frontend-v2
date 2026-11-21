"use client";

import { useState } from "react";
import { GraduationCap, UserRoundCog } from "lucide-react";
import MentorHero from "../MentorHero";
import FilterTabs from "@/components/common/FilterTabs";
import { MentorPagination, usePagination } from "../MentorPagination";
import { useMentorSnapshot } from "../MentorProvider";
import { Toolbar, EmptyState, MentorSection as SectionCard } from "../MentorCommon";
import { useRetained } from "../MentorModal";
import MentorCard from "./directory/MentorCard";
import MentorProfileModal from "./directory/MentorProfileModal";

export default function MentorDirectory({ onGiveFeedback }) {
  const { mentors: ALL_MENTORS, interns: MENTOR_INTERNS } = useMentorSnapshot();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const shownMentor = useRetained(selectedMentor);

  const filteredMentors = ALL_MENTORS.filter((mentor) => {
    const matchesFilter =
      filter === "all" || mentor.status.toLowerCase().replace(/\s+/g, "-") === filter;
    const matchesSearch = `${mentor.name} ${mentor.specialty} ${mentor.email}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterOptions = [
    { value: "all", label: "All", count: ALL_MENTORS.length },
    {
      value: "available",
      label: "Available",
      count: ALL_MENTORS.filter((m) => m.status === "Available").length,
    },
    {
      value: "on-leave",
      label: "On leave",
      count: ALL_MENTORS.filter((m) => m.status === "On leave").length,
    },
  ];

  const pager = usePagination(filteredMentors, `${search}|${filter}`);

  const mentorInterns = shownMentor
    ? MENTOR_INTERNS.filter((u) => u.mentor === shownMentor.name)
    : [];

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <MentorHero
        icon={GraduationCap}
        badge="Mentor Network"
        title="Balance coaching across your mentors."
        description="Balance coaching capacity, track mentorship quality, and align domain specialists."
      />

      <SectionCard revealIndex={1}>
        <Toolbar
          search={search}
          setSearch={setSearch}
          placeholder="Search mentors by name, specialty, or email..."
        >
          <FilterTabs value={filter} onChange={setFilter} options={filterOptions} />
        </Toolbar>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {pager.pageItems.map((mentor, i) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              index={i}
              onSelect={() => setSelectedMentor(mentor)}
            />
          ))}

          {!filteredMentors.length && (
            <div className="col-span-full">
              <EmptyState
                icon={UserRoundCog}
                title="No mentors found"
                description="Try another search term or status filter."
              />
            </div>
          )}
        </div>
        <MentorPagination pagination={pager} label="mentors" />
      </SectionCard>

      <MentorProfileModal
        selectedMentor={selectedMentor}
        shownMentor={shownMentor}
        onClose={() => setSelectedMentor(null)}
        mentorInterns={mentorInterns}
        onGiveFeedback={onGiveFeedback}
      />
    </div>
  );
}
