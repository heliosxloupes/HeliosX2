import { useEffect, useRef, useState } from "react";

/**
 * Tracks the active slide of a horizontal scroll-snap carousel and exposes a
 * programmatic scroll. Mobile-only carousels (Apple-style peek + dots) share
 * this; on desktop the same container is a CSS grid that never scrolls, so the
 * active index simply stays at 0 and the dots row is hidden behind `md:hidden`.
 */
export function useCarouselDots<T extends HTMLElement>(count: number) {
  const scrollerRef = useRef<T>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const children = Array.from(el.children) as HTMLElement[];
        if (!children.length) return;
        const viewportCenter = el.scrollLeft + el.clientWidth / 2;
        let closest = 0;
        let min = Infinity;
        children.forEach((child, i) => {
          const childCenter = child.offsetLeft + child.offsetWidth / 2;
          const dist = Math.abs(childCenter - viewportCenter);
          if (dist < min) {
            min = dist;
            closest = i;
          }
        });
        setActiveIndex(closest);
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [count]);

  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({
      left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  return { scrollerRef, activeIndex, scrollToIndex };
}
