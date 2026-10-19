"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";

type Service = {
  id: string;
  name: string;
  file: string;
  who: string;
  includes: string[];
  duration: string;
  price: string;
  cta: string;
  accent?: boolean;
  slogan?: string;
  photoNote?: boolean;
};

const services: Service[] = [
  {
    id: "brow-reset",
    name: "Brow Reset",
    file: "brow reset.JPG",
    who: "Для тех, кто хочет восстановить форму и естественный цвет бровей с нуля.",
    includes: [
      "Анализ пропорций лица",
      "Подбор индивидуального пигмента",
      "Отрисовка эскиза",
      "Перекрытие и коррекция",
    ],
    duration: "2–2.5 часа",
    price: "22\u00a0000",
    cta: "Записаться",
    accent: true,
  },
  {
    id: "perfect-brow",
    name: "Perfect Brow",
    file: "Perfect Brow.JPG",
    who: "Для идеальной формы и лёгкого пудрового эффекта каждый день.",
    includes: [
      "Архитектура бровей",
      "Мягкая теневая растушёвка",
      "Индивидуальный подбор тона",
    ],
    duration: "2 часа",
    price: "18\u00a0000",
    cta: "Записаться",
  },
  {
    id: "fresh-face",
    name: "Fresh Face",
    file: "Fresh Face.JPG",
    who: "Для свежего и отдохнувшего вида без повседневного макияжа.",
    includes: [
      "Межресничный контур",
      "Лёгкий акцент на глаза",
      "Выравнивание тона",
    ],
    duration: "1.5–2 часа",
    price: "14\u00a0000",
    cta: "Записаться",
  },
  {
    id: "soft-lips",
    name: "Soft Lips",
    file: "Soft Lips.JPG",
    who: "Для сочных губ с естественным контуром и красивым оттенком.",
    includes: [
      "Акварельная техника",
      "Коррекция асимметрии",
      "Увлажняющий уход",
    ],
    duration: "2 часа",
    price: "18\u00a0000",
    cta: "Записаться",
  },
  {
    id: "signature-look",
    name: "Signature Look",
    file: "Signature Look.JPG",
    who: "Комплексный перманентный макияж нескольких зон за один визит.",
    includes: [
      "Брови, губы и межресничка",
      "Единая гармоничная палитра",
      "Максимальная экономия времени",
    ],
    duration: "3.5–4 часа",
    price: "48\u00a0000",
    cta: "Записаться",
  },
  {
    id: "lina-refresh",
    name: "LINA Refresh",
    file: "LINA Refresh.JPG",
    slogan: "Старый перманент можно обновить, а не терпеть",
    who: "Обновление любой зоны спустя 6+ месяцев, онлайн-оценка по фото.",
    includes: [
      "Осветление и перекрытие старого пигмента",
      "Обновление цвета",
      "Коррекция формы",
    ],
    duration: "от 1.5 часов",
    price: "12\u00a0000",
    cta: "Отправить фото старого перманента",
    photoNote: true,
  },
];

const consultation: Service = {
  id: "consult",
  name: "Консультация",
  file: "",
  who: "",
  includes: [],
  duration: "",
  price: "",
  cta: "Записаться",
};

function photoSrc(file: string) {
  return `/pictures/${encodeURIComponent("услуги")}/${encodeURIComponent(file)}`;
}

export function ServicesSection({ whatsappHref }: { whatsappHref: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const activeIdRef = useRef(services[0].id);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [activeId, setActiveId] = useState(services[0].id);
  activeIdRef.current = activeId;
  const [openId, setOpenId] = useState<string | null>(null);
  const [narrow, setNarrow] = useState(false);
  const [selected, setSelected] = useState<Service>(services[0]);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 800px)");
    const sync = () => setNarrow(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 800px)");

    const placePhoto = () => {
      const stage = stageRef.current;
      const frame = frameRef.current;
      const card = cardRefs.current[activeIdRef.current];
      if (!stage || !frame || !card) return;
      if (narrow.matches) {
        frame.style.transform = "none";
        return;
      }
      const stageBox = stage.getBoundingClientRect();
      const cardBox = card.getBoundingClientRect();
      const frameH = frame.getBoundingClientRect().height;
      const raw = cardBox.top - stageBox.top + cardBox.height / 2 - frameH / 2;
      const min = -Math.min(48, frameH * 0.12);
      const max = Math.max(min, stageBox.height - frameH);
      const y = Math.min(max, Math.max(min, raw));
      frame.style.transform = `translateY(${y}px)`;
    };

    const apply = () => {
      if (reduced.matches || narrow.matches) {
        node.style.setProperty("--split", "1");
      } else {
        const rect = node.getBoundingClientRect();
        const start = window.innerHeight * 0.9;
        const end = window.innerHeight * 0.32;
        const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
        node.style.setProperty("--split", progress.toFixed(4));
      }
      placePhoto();
    };

    let frameId = 0;
    const request = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        apply();
      });
    };

    apply();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    reduced.addEventListener("change", request);
    narrow.addEventListener("change", request);
    const preview = frameRef.current;
    const stage = stageRef.current;
    const observer = new ResizeObserver(request);
    if (preview) observer.observe(preview);
    if (stage) observer.observe(stage);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      reduced.removeEventListener("change", request);
      narrow.removeEventListener("change", request);
      if (frameId) window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [activeId]);

  useEffect(() => {
    const openConsult = () => {
      setSelected(consultation);
      setSent(false);
      dialogRef.current?.querySelector("form")?.reset();
      if (!dialogRef.current?.open) dialogRef.current?.showModal();
    };

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href="#booking"]');
      if (!link) return;
      event.preventDefault();
      openConsult();
    };

    const onHash = () => {
      if (window.location.hash === "#booking") openConsult();
    };

    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHash);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  function closeBooking() {
    dialogRef.current?.close();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const comment = String(data.get("comment") || "").trim();
    const lines = [
      `Здравствуйте! Хочу записаться на «${selected.name}».`,
      `Имя: ${name}`,
      `Телефон: ${phone}`,
    ];
    if (selected.photoNote) {
      lines.push("Отправляю фото старого перманента следующим сообщением.");
    }
    if (comment) lines.push(`Комментарий: ${comment}`);

    const base = whatsappHref.split("?")[0];
    window.open(
      `${base}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSent(true);
  }

  return (
    <section
      className="services"
      id="services"
      ref={sectionRef}
      aria-labelledby={titleId}
    >
      <div className="container services__grid">
        <h2 className="services__title" id={titleId}>
          <span className="services__line services__line--lead">Найдите свой</span>
          <span className="services__line services__line--soft">оттенок красоты</span>
        </h2>

        <div className="services__stage" ref={stageRef}>
          <div className="services__preview" ref={frameRef}>
            <div className="services__frame">
              {services.map((service) => (
                <img
                  key={service.id}
                  src={photoSrc(service.file)}
                  alt={service.id === activeId ? service.name : ""}
                  className={service.id === activeId ? "is-active" : undefined}
                />
              ))}
            </div>
          </div>

          <div
            className="services__list"
            role={narrow ? undefined : "tablist"}
            aria-label="Услуги"
          >
            {services.map((service) => {
              const active = service.id === activeId;
              const open = openId === service.id;
              const toggle = () =>
                setOpenId((current) => (current === service.id ? null : service.id));
              return (
                <article
                  key={service.id}
                  ref={(node) => {
                    cardRefs.current[service.id] = node;
                  }}
                  className={[
                    "service",
                    service.accent ? "service--accent" : "",
                    active ? "is-active" : "",
                    open ? "is-open" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onMouseEnter={() => setActiveId(service.id)}
                  onFocusCapture={() => setActiveId(service.id)}
                >
                  <div
                    className="service__top"
                    role={narrow ? "button" : undefined}
                    tabIndex={narrow ? 0 : undefined}
                    aria-expanded={narrow ? open : undefined}
                    onClick={narrow ? toggle : undefined}
                    onKeyDown={
                      narrow
                        ? (event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              toggle();
                            }
                          }
                        : undefined
                    }
                  >
                    {narrow ? (
                      <span className="service__dot" aria-hidden="true" />
                    ) : (
                      <button
                        type="button"
                        role="tab"
                        className={
                          active ? "service__dot is-active" : "service__dot"
                        }
                        aria-label={service.name}
                        aria-selected={active}
                        onClick={() => setActiveId(service.id)}
                      />
                    )}
                    <h3 className="service__name">{service.name}</h3>
                    <p className="service__price" aria-hidden={narrow || undefined}>
                      от {service.price} ₽
                    </p>
                  </div>
                  <div className="service__panel" inert={narrow && !open ? true : undefined}>
                    <div className="service__panel-inner">
                      {service.slogan ? (
                        <p className="service__slogan">{service.slogan}</p>
                      ) : null}
                      <p className="service__who">{service.who}</p>
                      <ul className="service__includes">
                        {service.includes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <p className="service__time service__time--panel">
                        {service.duration}
                      </p>
                      <img
                        className="service__photo"
                        src={photoSrc(service.file)}
                        alt=""
                      />
                      <p className="service__price service__price--panel">
                        от {service.price} ₽
                      </p>
                      <div className="service__foot">
                        <p className="service__time">{service.duration}</p>
                        <a className="btn btn--accent btn--compact" href="#form">
                          {service.cta}
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="services__notes">
          <p>
            Также: мини-татуировки, трихопигментация, камуфляж шрамов, уход за
            губами — подробности в мессенджере
          </p>
          <p>Эскиз, анестезия и рекомендации уже в цене</p>
        </div>
      </div>

      <dialog
        className="booking"
        ref={dialogRef}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeBooking();
        }}
        onClose={() => setSent(false)}
      >
        <form className="booking__form" onSubmit={onSubmit}>
          <div className="booking__head">
            <h3>Запись</h3>
            <button type="button" className="booking__close" onClick={closeBooking}>
              Закрыть
            </button>
          </div>
          <p className="booking__service">
            Услуга: <strong>{selected.name}</strong>
          </p>
          {selected.photoNote ? (
            <p className="booking__hint">
              После отправки прикрепите фото старого перманента в чате WhatsApp.
            </p>
          ) : null}
          <label>
            Имя
            <input name="name" type="text" required autoComplete="name" />
          </label>
          <label>
            Телефон
            <input name="phone" type="tel" required autoComplete="tel" />
          </label>
          <label>
            Комментарий
            <textarea name="comment" rows={3} />
          </label>
          <button className="btn btn--accent btn--compact" type="submit">
            Отправить заявку
          </button>
          {sent ? (
            <p className="booking__sent" role="status">
              Черновик открыт в WhatsApp. Осталось нажать «Отправить» в чате.
            </p>
          ) : null}
        </form>
      </dialog>
    </section>
  );
}
