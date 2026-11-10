"use client";

// The demo store in the browser (ADR 0001). Every demo screen reads with
// `useDemo()` and writes with `update()`. Nothing else touches storage.

import { useSyncExternalStore } from "react";
import { localToday } from "./dates";
import { advanceDay } from "./engine";
import { createSampleState } from "./sample";
import type { DemoEvent, DemoState } from "./types";

const KEY = "quote-to-paid-demo-v1";

let state: DemoState | null = null;
let lastSkip: { day: number; events: DemoEvent[] } | null = null;
const listeners = new Set<() => void>();
let memoryOnly = false;

function read(): DemoState {
  if (state) return state;
  try {
    const raw = window.localStorage.getItem(KEY);
    const saved = raw ? (JSON.parse(raw) as DemoState) : null;
    if (saved?.version === 1) return (state = saved);
  } catch {
    // Private windows and some embeds block storage: keep it in memory.
    memoryOnly = true;
  }
  return (state = createSampleState(localToday()));
}

function write(next: DemoState) {
  state = next;
  if (!memoryOnly) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      memoryOnly = true;
    }
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getServer = () => null;

/** The demo state, or null while the page is still starting in the browser. */
export function useDemo(): DemoState | null {
  return useSyncExternalStore(subscribe, read, getServer);
}

/** The last "Skip ahead a day", for the day summary. */
export function useLastSkip() {
  return useSyncExternalStore(subscribe, () => lastSkip, () => null);
}

export function update(fn: (s: DemoState) => DemoState) {
  write(fn(read()));
}

export function skipDay() {
  const result = advanceDay(read());
  lastSkip = { day: result.state.day, events: result.events };
  write(result.state);
}

export function clearLastSkip() {
  lastSkip = null;
  listeners.forEach((l) => l());
}

export function resetDemo() {
  lastSkip = null;
  write(createSampleState(localToday()));
}
