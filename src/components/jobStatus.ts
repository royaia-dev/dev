import type { JobStatus } from "@/lib/store";

export const STATUS_LABEL: Record<JobStatus, string> = {
  matching: "Matching",
  offers: "Offers received",
  awarded: "Awarded · escrow held",
  in_progress: "Work in progress",
  evidence_submitted: "Evidence submitted",
  completed: "Completed · payment released",
};

export const STATUS_TONE: Record<JobStatus, "neutral" | "amber" | "green" | "blue" | "violet"> = {
  matching: "neutral",
  offers: "amber",
  awarded: "blue",
  in_progress: "blue",
  evidence_submitted: "violet",
  completed: "green",
};
