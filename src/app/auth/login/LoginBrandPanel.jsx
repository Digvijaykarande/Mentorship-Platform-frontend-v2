import Link from "next/link";
import { BadgeCheck, GitPullRequest, MessageSquareText, Quote, TrendingUp } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: TrendingUp,
    title: "Track real progress",
    text: "Projects, tasks and milestones in one clear view.",
  },
  {
    icon: MessageSquareText,
    title: "Mentor feedback, fast",
    text: "Submit work and get reviews without chasing anyone.",
  },
  {
    icon: GitPullRequest,
    title: "Build a clear record",
    text: "Every version and review kept as your internship portfolio.",
  },
];

const SHORT = "[@media(max-height:700px)]:hidden";
const VERY_SHORT = "[@media(max-height:620px)]:hidden";

export default function LoginBrandPanel() {
  return (
    <aside className="relative hidden min-h-0 overflow-hidden bg-[#101426] p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-10">
      <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-110px] right-[22%] h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse at 30% 40%, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 30% 40%, black 20%, transparent 75%)",
        }}
      />

      <div className="relative">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm font-bold text-white ring-1 ring-white/15">
            L
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-bold tracking-tight text-white">
              Loyanox
            </span>
            <span className="block text-[10px] text-slate-400">
              Mentor Platform
            </span>
          </span>
        </Link>
      </div>

      <div className="relative max-w-lg">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-primary-100">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
          Keep your progress moving
        </span>
        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] xl:text-[2.5rem] [@media(max-height:700px)]:text-2xl">
          Submit work.
          <br />
          <span className="bg-gradient-to-r from-primary-300 to-cyan-200 bg-clip-text text-transparent">
            Get better.
          </span>
        </h2>
        <p className={`mt-3 max-w-md text-sm leading-6 text-slate-300 ${SHORT}`}>
          One workspace for interns and mentors: share completed work, turn
          feedback into action and keep a record of your growth.
        </p>

        <ul className={`mt-6 space-y-3 ${VERY_SHORT}`}>
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="group flex items-start gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-primary-200 ring-1 ring-white/10 transition group-hover:bg-primary-500/30 group-hover:text-white">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs leading-5 text-slate-400">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Mentor feedback card */}
      <div className={`relative max-w-md ${SHORT}`}>
        <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
          <Quote className="absolute right-4 top-4 h-6 w-6 rotate-180 text-white/10" />
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-xs font-bold ring-2 ring-white/10">
              MP
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                Mayur Patil
                <BadgeCheck className="h-4 w-4 fill-primary-500 text-[#101426]" />
              </p>
              <p className="text-[11px] text-slate-400">
                Senior Software Developer · Mentor
              </p>
            </div>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-slate-200">
            &ldquo;Good progress on the dashboard implementation. Focus next
            on responsive behavior and reusable components.&rdquo;
          </p>
        </div>
      </div>
    </aside>
  );
}
