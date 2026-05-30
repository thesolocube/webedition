"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import {
  subscribeContinueWatching,
  migrateLocalWatchHistory,
} from "@/lib/continueWatching";
import type { WatchProgress } from "@/lib/watchHistory";

export function useWatchHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<WatchProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      await migrateLocalWatchHistory(user.uid);
      if (cancelled) return;

      unsubscribe = subscribeContinueWatching(user.uid, (items) => {
        setHistory(items);
        setLoading(false);
      });
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [user]);

  return { history, loading };
}
