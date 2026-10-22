"use client";

import { useId, useRef } from "react";
import { useReveal } from "./use-reveal";

const photoSrc = `/pictures/${encodeURIComponent("Акция.png")}`;

export function PromoSection() {
  const titleId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  useReveal(sectionRef);

  return (
    <section className="promo" aria-labelledby={titleId} ref={sectionRef}>
      <div className="container promo__layout">
        <div className="promo__copy">
          <h2 className="promo__title" id={titleId}>
            <span className="promo__title-line promo__title-line--from-right">Первым</span>
            <span className="promo__title-line promo__title-line--from-left">20 клиенткам</span>
          </h2>
          <p className="promo__kicker">Перманент бровей + подарок</p>
        </div>

        <figure className="promo__photo">
          <div className="promo__frame">
            <img src={photoSrc} alt="" />
            <p className="promo__placeholder">Место для фотографии</p>
          </div>
        </figure>

        <div className="promo__details">
          <div>
            <p className="promo__was promo__reveal" style={{ ["--promo-delay" as string]: "0ms" }}>
              <span className="promo__sr">Обычная цена</span>
              <s>8&nbsp;000&nbsp;₽</s>
            </p>
            <p className="promo__now promo__reveal" style={{ ["--promo-delay" as string]: "110ms" }}>
              <span className="promo__sr">Акционная цена</span>
              5&nbsp;900&nbsp;₽
            </p>
          </div>

          <div>
            <p className="promo__gift-name promo__reveal" style={{ ["--promo-delay" as string]: "220ms" }}>
              Уходовый набор для бровей
            </p>
            <p className="promo__gift-note promo__reveal" style={{ ["--promo-delay" as string]: "330ms" }}>
              В подарок к процедуре
            </p>
          </div>

          <p className="promo__until promo__reveal" style={{ ["--promo-delay" as string]: "440ms" }}>
            До 15 ноября 2026 года
          </p>

          <div className="promo__seats promo__reveal" style={{ ["--promo-delay" as string]: "550ms" }}>
            <p className="promo__count" aria-label="Осталось 12 из 20 мест">
              <span className="promo__count-now">12</span>
              <span className="promo__count-rule" aria-hidden="true">/</span>
              <span className="promo__count-all">20</span>
            </p>
            <p className="promo__count-label">мест осталось</p>
          </div>

          <a
            className="btn btn--accent btn--compact promo__cta promo__reveal"
            href="#form"
            style={{ ["--promo-delay" as string]: "660ms" }}
          >
            Записаться по спеццене
          </a>
        </div>
      </div>
    </section>
  );
}
