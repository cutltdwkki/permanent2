"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  { href: "#services", label: "Услуги" },
  { href: "#faq", label: "Частые вопросы" },
  { href: "#contacts", label: "Контакты" },
];

const blurLayers = [
  { blur: "12px", mask: "linear-gradient(to bottom, #000 0%, #000 8%, transparent 40%)" },
  { blur: "6px", mask: "linear-gradient(to bottom, #000 0%, #000 22%, transparent 62%)" },
  { blur: "3px", mask: "linear-gradient(to bottom, #000 0%, #000 38%, transparent 82%)" },
  { blur: "1px", mask: "linear-gradient(to bottom, #000 0%, #000 52%, transparent 100%)" },
];

export function SiteHeader({
  phoneDisplay,
  phoneHref,
}: {
  phoneDisplay: string;
  phoneHref: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero");

    const update = () => {
      const bottom = hero
        ? hero.getBoundingClientRect().bottom
        : window.innerHeight - window.scrollY;
      setSolid(bottom < 140);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
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

  return (
    <header className={solid ? "site-header is-solid" : "site-header"}>
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
    </header>
  );
}
