"use client";

import { useEffect, useRef, useState } from "react";

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
 *
 * Or for stagger groups:
 *   <ul ref={ref} className={cn("reveal-stagger", inView && "in-view")}>
 *     <li>item 1</li><li>item 2</li>...
 *   </ul>
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: { threshold?: number; rootMargin?: string } = {},
): [React.RefObject<T | null>, boolean] {
  const { threshold = 0.2, rootMargin = "0px 0px -10% 0px" } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    // Respect reduced-motion: skip the observer, show content immediately
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInView(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    // If IntersectionObserver is unavailable, show content immediately
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

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
  }, [threshold, rootMargin]);

  return [ref, inView];
}
