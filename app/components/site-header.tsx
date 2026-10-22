"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  { href: "#services", label: "Услуги" },
  { href: "#results", label: "Работы" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#faq", label: "Вопросы" },
];

const blurLayers = [
  { blur: "12px", mask: "linear-gradient(to bottom, #000 0%, #000 8%, transparent 40%)" },
  { blur: "6px", mask: "linear-gradient(to bottom, #000 0%, #000 22%, transparent 62%)" },
  { blur: "3px", mask: "linear-gradient(to bottom, #000 0%, #000 38%, transparent 82%)" },
  { blur: "1px", mask: "linear-gradient(to bottom, #000 0%, #000 52%, transparent 100%)" },
];

const accentSelector = ".results, .apply";

function accentUnderHeader(headerH: number) {
  const nodes = document.querySelectorAll(accentSelector);
  for (const node of nodes) {
    const rect = node.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < headerH) return true;
  }
  return false;
}

export function SiteHeader({
  phoneDisplay,
  phoneHref,
}: {
  phoneDisplay: string;
  phoneHref: string;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [solid, setSolid] = useState(false);
  const [onAccent, setOnAccent] = useState(false);
  const [footerNear, setFooterNear] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero");
    const footer = document.querySelector(".site-footer");
    let frame = 0;

    const footerIsNear = () => {
      if (!footer) return false;
      const rect = footer.getBoundingClientRect();
      return rect.top < window.innerHeight + 48 && rect.bottom > 0;
    };

    const update = () => {
      frame = 0;
      const headerH = headerRef.current?.offsetHeight ?? 84;
      const heroBottom = hero
        ? hero.getBoundingClientRect().bottom
        : window.innerHeight - window.scrollY;

      setSolid(heroBottom < 140);
      setOnAccent(accentUnderHeader(headerH));
      setFooterNear(footerIsNear());
    };

    const onScrollOrResize = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    const observer = footer
      ? new IntersectionObserver(
          ([entry]) => {
            setFooterNear(Boolean(entry?.isIntersecting) || footerIsNear());
          },
          {
            root: null,
            // Прячем хедер чуть раньше, чем футер полностью займёт кадр.
            rootMargin: "0px 0px 48px 0px",
            threshold: 0,
          },
        )
      : null;

    if (footer && observer) observer.observe(footer);

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (frame) window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const className = [
    "site-header",
    solid ? "is-solid" : "",
    onAccent ? "is-on-accent" : "",
    footerNear && !open ? "is-hidden" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header
        ref={headerRef}
        className={className}
        aria-hidden={footerNear && !open ? true : undefined}
      >
        <span className="site-header__veil" aria-hidden="true">
          {blurLayers.map((layer) => (
            <span
              key={layer.blur}
              style={{
                backdropFilter: `blur(${layer.blur})`,
                WebkitBackdropFilter: `blur(${layer.blur})`,
                maskImage: layer.mask,
                WebkitMaskImage: layer.mask,
              }}
            />
          ))}
        </span>
        <div className="container site-header__inner">
          <a className="logo" href="/">
            <span className="logo__word">LINA</span>
            <span className="logo__pm">pm</span>
            <span className="logo__word">CODE</span>
          </a>
          <nav className="nav" aria-label="Основная навигация">
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            className="menu-toggle"
            aria-label="Открыть меню"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        id="site-menu"
        className={open ? "menu is-open" : "menu"}
        aria-hidden={!open}
        inert={open ? undefined : true}
        role="dialog"
        aria-modal="true"
        aria-label="Меню"
      >
        <div className="menu__top">
          <a className="logo menu__logo" href="/" onClick={() => setOpen(false)}>
            <span className="logo__word">LINA</span>
            <span className="logo__pm">pm</span>
            <span className="logo__word">CODE</span>
          </a>
          <button
            type="button"
            ref={closeRef}
            className="menu__close"
            aria-label="Закрыть меню"
            onClick={() => setOpen(false)}
          >
            <span />
            <span />
          </button>
        </div>
        <nav className="menu__nav" aria-label="Разделы">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="btn btn--accent menu__book" href="#booking" onClick={() => setOpen(false)}>
          Записаться на консультацию
        </a>
        <a className="menu__phone" href={phoneHref}>
          {phoneDisplay}
        </a>
      </div>
    </>
  );
}
