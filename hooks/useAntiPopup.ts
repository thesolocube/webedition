"use client";

import { useEffect } from "react";

/**
 * Bloque window.open et les redirections forcées pendant la lecture.
 */
export function useAntiPopup(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const originalOpen = window.open.bind(window);
    window.open = () => null;

    const blockBlank = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (anchor?.target === "_blank" && anchor.closest("[data-player-shell]")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("click", blockBlank, true);

    return () => {
      window.open = originalOpen;
      document.removeEventListener("click", blockBlank, true);
    };
  }, [active]);
}
