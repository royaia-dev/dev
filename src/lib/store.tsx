"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Offer, ParsedJob } from "./matching";

export type JobStatus =
  | "matching"
  | "offers"
  | "awarded"
  | "in_progress"
  | "evidence_submitted"
  | "completed";

export type EvidenceItem = {
  kind: "photo" | "telemetry" | "report" | "location";
  label: string;
  detail: string;
};

export type TimelineEntry = {
  at: string;
  actor: "customer" | "platform" | "provider" | "machine";
  message: string;
};

export type Job = {
  id: string;
  title: string;
  request: string;
  site: string;
  deadlineHours: number;
  budget?: number;
  parsed: ParsedJob;
  offers: Offer[];
  acceptedOfferId?: string;
  status: JobStatus;
  escrowHeld: number;
  evidence: EvidenceItem[];
  timeline: TimelineEntry[];
  createdAt: string;
};

type Store = {
  jobs: Job[];
  ready: boolean;
  addJob: (job: Job) => void;
  updateJob: (id: string, update: (job: Job) => Job) => void;
  reset: () => void;
};

const StoreContext = createContext<Store | null>(null);

const STORAGE_KEY = "capability-exchange-jobs";

export function nowLabel(): string {
  return new Date().toLocaleString("en-AU", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" });
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setJobs(JSON.parse(raw) as Job[]);
    } catch {
      // ignore malformed local state
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  }, [jobs, ready]);

  const addJob = useCallback((job: Job) => setJobs((prev) => [job, ...prev]), []);

  const updateJob = useCallback(
    (id: string, update: (job: Job) => Job) =>
      setJobs((prev) => prev.map((job) => (job.id === id ? update(job) : job))),
    [],
  );

  const reset = useCallback(() => setJobs([]), []);

  const value = useMemo(() => ({ jobs, ready, addJob, updateJob, reset }), [jobs, ready, addJob, updateJob, reset]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside StoreProvider");
  return store;
}
