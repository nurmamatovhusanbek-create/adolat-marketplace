"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * useInView — scroll-reveal hook per animation-on-scroll.md
 *
 * Behavior:
 * - Triggers when element is ~20-30% visible (threshold 0.2)
 * - Fires ONCE — does not replay on every scroll
 * - Respects prefers-reduced-motion (returns true immediately so content stays visible)
 *
 * Usage:
 *   const [ref, inView] = useInView<HTMLDivElement>();
 *   <div ref={ref} className={cn("reveal-on-scroll", inView && "in-view")}>...</div>
 */

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: { threshold?: number; rootMargin?: string } = {},
): [React.RefObject<T | null>, boolean] {
  const { threshold = 0.2, rootMargin = "0px 0px -10% 0px" } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  // Use useSyncExternalStore for prefers-reduced-motion to avoid setState-in-effect
  const reducedMotion = useSyncExternalStore(subscribe, prefersReducedMotion, () => false);

  useEffect(() => {
    // If reduced motion or no IntersectionObserver, content is already visible
    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, reducedMotion]);

  // If reduced motion, always return true (content visible, no animation)
  return [ref, reducedMotion || inView];
}
