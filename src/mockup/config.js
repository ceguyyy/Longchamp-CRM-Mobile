/*
 * Shared CMS & configuration store for the mockup.
 * Stands in for GET /v1/app/config (H-02): what the Super Admin saves in CMS & configuration
 * shows up in every role's app while the page is open (no reload, across role switches).
 */
import { useSyncExternalStore } from "react";
import { APP_CONTENT, APP_SETTINGS } from "./data";

export const TODAY = "2026-11-17";

let state = {
  content: APP_CONTENT,
  settings: Object.fromEntries([...APP_SETTINGS.rules, ...APP_SETTINGS.app].map((s) => [s.key, s.value])),
  version: 42,
};
const subs = new Set();
const emit = () => subs.forEach((f) => f());

export const configStore = {
  get: () => state,
  subscribe: (f) => {
    subs.add(f);
    return () => subs.delete(f);
  },
  setSettings(values) {
    state = { ...state, settings: { ...state.settings, ...values }, version: state.version + 1 };
    emit();
  },
  saveContent(item) {
    const exists = state.content.some((c) => c.content_id === item.content_id);
    const next = exists ? state.content.map((c) => (c.content_id === item.content_id ? item : c)) : [...state.content, { ...item, content_id: Date.now() }];
    state = { ...state, content: next, version: state.version + 1 };
    emit();
  },
};

export function useConfig() {
  return useSyncExternalStore(configStore.subscribe, configStore.get, configStore.get);
}

/* scheduled / live / ended / draft, from status and dates (as the API's display_status) */
export function displayStatus(c) {
  if (c.status === "draft") return "draft";
  if (c.start_at > TODAY) return "scheduled";
  if (c.end_at < TODAY) return "ended";
  return "live";
}

/* Content the app shows for this role and boutique today (H-02 filter) */
export function liveContent(content, kind, role, boutiqueName) {
  return content.find(
    (c) =>
      c.kind === kind &&
      displayStatus(c) === "live" &&
      (c.audience === "all" || c.audience === role) &&
      (c.boutique === "all" || c.boutique === boutiqueName)
  );
}
