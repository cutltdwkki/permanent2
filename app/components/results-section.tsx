"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useReveal } from "./use-reveal";

const folder = `/pictures/${encodeURIComponent("результат")}`;

type Work = {
  file: string;
  alt: string;
  /** Название варианта перманента. */
  name: string;
  /** Зона. Пустое поле — ещё не заполнено. */
  zone: string;
  /** Техника. Пустое поле — ещё не заполнено. */
  technique: string;
  /** Ориентировочный срок носки. Пустое поле — ещё не заполнено. */
  when: string;
};

const works: Work[] = [
  {
    file: "IMG_4179.JPG",
    alt: "Brow Reset: портрет с оформленными бровями",
    name: "Brow Reset",
    zone: "Брови",
    technique: "Пудровое напыление",
    when: "1–2 года",
  },
  {
    file: "до после 2.JPG",
    alt: "Perfect Brow: сравнение лица до и после оформления бровей",
    name: "Perfect Brow",
    zone: "Брови",
    technique: "Волосковая техника",
    when: "1–1,5 года",
  },
  {
    file: "IMG_4177.JPG",
    alt: "LINA Refresh: крупный план бровей",
    name: "LINA Refresh",
    zone: "Брови со старым перманентом",
    technique: "Коррекция оттенка и формы, мягкое напыление",
    when: "1–2 года",
  },
  {
    file: "до после 1.JPG",
    alt: "Soft Lips: губы до процедуры и заживший результат",
    name: "Soft Lips",
    zone: "Вся поверхность губ",
    technique: "Акварельное напыление",
    when: "1–2 года",
  },
  {
    file: "IMG_4185.JPG",
    alt: "Fresh Lips: крупный план губ",
    name: "Fresh Lips",
    zone: "Контур и поверхность губ",
    technique: "Контур с мягкой растушёвкой",
    when: "1–2 года",
  },
  {
    file: "IMG_2352.PNG",
    alt: "Lash Line: крупный план глаза",
    name: "Lash Line",
    zone: "Межресничное пространство верхнего века",
    technique: "Межресничная стрелка",
    when: "1–2 года",
  },
  {
    file: "IMG_3230.JPG",
    alt: "Soft Eyeliner: крупный план глаза и брови",
    name: "Soft Eyeliner",
    zone: "Верхнее веко",
    technique: "Тонкая стрелка с растушёвкой",
    when: "1–2 года",
  },
  {
    file: "IMG_4187.JPG",
    alt: "Express Eyes: крупный план ресниц и века",
    name: "Express Eyes",
    zone: "Верхнее и нижнее межресничное пространство",
    technique: "Межресничное заполнение",
    when: "1–2 года",
  },
];

function photoSrc(file: string) {
  return `${folder}/${encodeURIComponent(file)}`;
}

type Frame = { top: number; left: number; width: number; height: number };

function contain(ratio: number, bounds: Frame): Frame {
  const safe = ratio > 0 ? ratio : 0.75;
  const boxRatio = bounds.width / bounds.height;
  const width = safe > boxRatio ? bounds.width : bounds.height * safe;
  const height = safe > boxRatio ? bounds.width / safe : bounds.height;
  return {
    top: bounds.top + (bounds.height - height) / 2,
    left: bounds.left + (bounds.width - width) / 2,
    width,
    height,
  };
}

function viewportFrame(ratio: number): Frame {
  const side = Math.max(52, window.innerWidth * 0.055);
  const top = Math.max(56, 16 + (window.visualViewport?.offsetTop ?? 0));
  const bottom = Math.max(76, 24);
  return contain(ratio, {
    top,
    left: side,
    width: Math.max(120, window.innerWidth - side * 2),
    height: Math.max(120, window.innerHeight - top - bottom),
  });
}

const fields = [
  { key: "zone", label: "Зона" },
  { key: "technique", label: "Техника" },
  { key: "when", label: "Срок носки" },
] as const;

function Viewer({
  work,
  index,
  total,
  frame,
  phase,
  dim,
  closeRef,
  onClose,
  onStep,
  onPointerDown,
  onPointerUp,
}: {
  work: Work;
  index: number;
  total: number;
  frame: Frame;
  phase: "from" | "open" | "closing";
  dim: boolean;
  closeRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onStep: (direction: number) => void;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void;
}) {
  const details = fields
    .map((field) => (work[field.key] ? `${field.label}: ${work[field.key]}` : ""))
    .filter(Boolean)
    .join("  ·  ");
  const caption = [work.name, details].filter(Boolean).join("  ·  ");

  return (
    <div
      className={`results-view${phase === "open" ? " is-open" : ""}${phase === "closing" ? " is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр работы"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <button type="button" className="results-view__backdrop" aria-label="Закрыть просмотр" onClick={onClose} />
      <div className="results-view__chrome">
        <button type="button" className="results-view__close" ref={closeRef} onClick={onClose} aria-label="Закрыть">
          ×
        </button>
        <button type="button" className="results-view__nav results-view__nav--prev" onClick={() => onStep(-1)} aria-label="Предыдущая фотография">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14.5 5.5 8 12l6.5 6.5" />
          </svg>
        </button>
        <button type="button" className="results-view__nav results-view__nav--next" onClick={() => onStep(1)} aria-label="Следующая фотография">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9.5 5.5 16 12l-6.5 6.5" />
          </svg>
        </button>
        <p className="results-view__count" aria-live="polite">
          {index + 1} / {total}
        </p>
        {caption ? <p className="results-view__meta">{caption}</p> : null}
      </div>
      <img
        className={`results-view__img${dim ? " is-dim" : ""}`}
        style={frame}
        src={photoSrc(work.file)}
        alt={work.alt}
        draggable={false}
      />
    </div>
  );
}

export function ResultsSection() {
  const titleId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const ratios = useRef<number[]>([]);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const touchScroll = useRef(0);
  const stopClickRef = useRef<((click: Event) => void) | null>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const lockRef = useRef<number | null>(null);
  const closeTimer = useRef(0);
  const swapTimer = useRef(0);
  const life = useRef(0);
  const focusedOpen = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);
  const [phase, setPhase] = useState<"from" | "open" | "closing">("from");
  const [dim, setDim] = useState(false);

  useReveal(sectionRef);

  useEffect(() => {
    setMounted(true);
  }, []);

  function clearClickSuppress(rail: HTMLDivElement) {
    if (!stopClickRef.current) return;
    rail.removeEventListener("click", stopClickRef.current, true);
    stopClickRef.current = null;
  }

  function suppressClick(rail: HTMLDivElement) {
    clearClickSuppress(rail);
    const stopClick = (click: Event) => {
      click.preventDefault();
      click.stopPropagation();
      clearClickSuppress(rail);
    };
    stopClickRef.current = stopClick;
    rail.addEventListener("click", stopClick, true);
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    if (!rail) return;
    clearClickSuppress(rail);
    touchScroll.current = rail.scrollLeft;
    dragRef.current.moved = false;
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    dragRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: rail.scrollLeft,
      moved: false,
    };
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag.active || event.pointerType !== "mouse") return;
    const delta = event.clientX - drag.startX;
    if (!drag.moved) {
      if (Math.abs(delta) < 10) return;
      drag.moved = true;
      rail.classList.add("is-dragging");
      try {
        rail.setPointerCapture(event.pointerId);
      } catch {
        // Указатель уже отпущен — прокрутка всё равно продолжится по этому жесту.
      }
    }
    rail.scrollLeft = drag.scrollLeft - delta;
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    if (!rail) return;
    const drag = dragRef.current;
    if (event.pointerType !== "mouse" && Math.abs(rail.scrollLeft - touchScroll.current) > 10) {
      drag.moved = true;
    }
    if (!drag.active && !drag.moved) return;
    drag.active = false;
    rail.classList.remove("is-dragging");
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
    if (drag.moved) suppressClick(rail);
  }

  function ratioFor(index: number) {
    const known = ratios.current[index];
    if (known) return known;
    const image = cardRefs.current[index]?.querySelector("img");
    if (image && image.naturalWidth > 0) {
      const ratio = image.naturalWidth / image.naturalHeight;
      ratios.current[index] = ratio;
      return ratio;
    }
    return 0.75;
  }

  function lockScroll() {
    if (lockRef.current !== null) return;
    const y = window.scrollY;
    lockRef.current = y;
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }

  function unlockScroll() {
    if (lockRef.current === null) return;
    const y = lockRef.current;
    lockRef.current = null;
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, y);
  }

  function openAt(index: number) {
    if (!works[index] || dragRef.current.moved) return;
    const image = cardRefs.current[index]?.querySelector("img");
    if (!image) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ratio = ratioFor(index);
    const from = contain(ratio, image.getBoundingClientRect());
    const to = viewportFrame(ratio);
    window.clearTimeout(closeTimer.current);
    life.current += 1;
    const ticket = life.current;
    setDim(false);
    setActive(index);
    setFrame(reduced ? to : from);
    setPhase(reduced ? "open" : "from");
    lockScroll();
    if (reduced) return;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (life.current !== ticket) return;
        setFrame(to);
        setPhase("open");
      });
    });
  }

  function finishClose() {
    const index = active;
    setActive(null);
    setFrame(null);
    setPhase("from");
    setDim(false);
    unlockScroll();
    if (index !== null) cardRefs.current[index]?.focus({ preventScroll: true });
  }

  function closeViewer() {
    if (active === null || phase === "closing") return;
    life.current += 1;
    const ticket = life.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const image = cardRefs.current[active]?.querySelector("img");
    if (reduced || !image || !frame) {
      finishClose();
      return;
    }
    setPhase("closing");
    setFrame(contain(ratioFor(active), image.getBoundingClientRect()));
    closeTimer.current = window.setTimeout(() => {
      if (life.current !== ticket) return;
      finishClose();
    }, 520);
  }

  function step(direction: number) {
    if (active === null || works.length === 0 || phase === "closing") return;
    const next = (active + direction + works.length) % works.length;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.clearTimeout(swapTimer.current);
    if (reduced) {
      setActive(next);
      setFrame(viewportFrame(ratioFor(next)));
      return;
    }
    setDim(true);
    swapTimer.current = window.setTimeout(() => {
      setActive(next);
      setFrame(viewportFrame(ratioFor(next)));
      setDim(false);
    }, 180);
  }

  useEffect(() => {
    if (active === null) {
      focusedOpen.current = false;
      return;
    }
    if (phase === "open" && !focusedOpen.current) {
      focusedOpen.current = true;
      closeRef.current?.focus();
    }
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeViewer();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
    };
    const onResize = () => {
      if (phase !== "open") return;
      setFrame(viewportFrame(ratioFor(active)));
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
    // Listeners follow the open slide. Recreated when the slide or phase changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, phase]);

  useEffect(() => {
    return () => unlockScroll();
  }, []);

  function onViewerPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;
    swipeRef.current = { x: event.clientX, y: event.clientY };
  }

  function onViewerPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start || event.pointerType === "mouse") return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    step(dx < 0 ? 1 : -1);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const rail = railRef.current;
    if (!rail) return;
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = Math.round(rail.clientWidth * 0.72);
    rail.scrollBy({
      left: event.key === "ArrowRight" ? step : -step,
      behavior: reduced ? "auto" : "smooth",
    });
  }

  return (
    <section className="results" id="results" ref={sectionRef} aria-labelledby={titleId}>
      <div className="container results__layout">
        <div className="results__copy">
          <h2 className="results__title" id={titleId}>
            Результат — сразу и после заживления
          </h2>
          <p className="results__lead">
            Один и тот же перманент в день процедуры и после заживления. Так
            проще выбрать оттенок и плотность, которые вам близки.
          </p>
          <a className="btn btn--light btn--compact results__action" href="#booking">
            Хочу такой же результат
          </a>
        </div>

        <div
          className="results__rail"
          ref={railRef}
          tabIndex={0}
          aria-label="Галерея результатов. Листайте перетаскиванием мыши или стрелками"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
        >
          <ul className="results__track">
            {works.map((work, index) => (
              <li key={work.file}>
                <button
                  type="button"
                  className="results__card"
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  onClick={() => openAt(index)}
                >
                  <img
                    src={photoSrc(work.file)}
                    alt={work.alt}
                    draggable={false}
                    onLoad={(event) => {
                      const image = event.currentTarget;
                      if (image.naturalWidth > 0) {
                        ratios.current[index] = image.naturalWidth / image.naturalHeight;
                      }
                    }}
                  />
                  <span className="results__caption">
                    <span className="results__name">{work.name || "—"}</span>
                    {fields.map((field) => {
                      const value = work[field.key];
                      return (
                        <span key={field.key}>
                          <span className="results__label">{field.label}</span>{" "}
                          <span className={value ? undefined : "is-empty"}>{value || "—"}</span>
                        </span>
                      );
                    })}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {mounted && active !== null && frame
        ? createPortal(
            <Viewer
              work={works[active]}
              index={active}
              total={works.length}
              frame={frame}
              phase={phase}
              dim={dim}
              closeRef={closeRef}
              onClose={closeViewer}
              onStep={step}
              onPointerDown={onViewerPointerDown}
              onPointerUp={onViewerPointerUp}
            />,
            document.body,
          )
        : null}
    </section>
  );
}
