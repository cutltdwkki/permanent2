"use client";

import { useLayoutEffect, type RefObject } from "react";

export function useReveal(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const show = () => node.classList.add("is-shown");
    node.classList.add("is-ready");
    if (reduced.matches) {
      show();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        show();
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.18 },
    );
    observer.observe(node);
    const onChange = () => {
      if (reduced.matches) show();
    };
    reduced.addEventListener("change", onChange);
    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", onChange);
    };
  }, [ref]);
}
