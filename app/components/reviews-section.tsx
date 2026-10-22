"use client";

import { useId, useLayoutEffect, useRef } from "react";

type Review = {
  name: string;
  service: string;
  text: string;
  photo?: string;
};

const reviewPhotosDir = `/pictures/${encodeURIComponent("отзывы")}`;

const reviews: Review[] = [
  {
    name: "Анна",
    service: "Перманент бровей",
    photo: `${reviewPhotosDir}/0145e776f2068f83b23f278ee262f5db.jpg`,
    text: "Долго решалась, потому что боялась получить слишком тёмные и нарисованные брови. Но здесь мне сначала подобрали форму, сделали эскиз, и я увидела, как всё будет выглядеть. Результат получился очень естественным! Лицо стало выразительнее, а каждое утро теперь экономлю время на макияже.",
  },
  {
    name: "Мария",
    service: "Перманент бровей",
    photo: `${reviewPhotosDir}/3bebc5f997ed8b5197bd84c5498f67c1.jpg`,
    text: "Очень переживала из-за боли, но всё прошло гораздо спокойнее, чем я представляла. Мастер объясняла каждый этап и спрашивала, комфортно ли мне. Брови получились аккуратные, без эффекта двух одинаковых нарисованных полосок. Именно такой результат я и хотела.",
  },
  {
    name: "Екатерина",
    service: "Перманент бровей",
    photo: `${reviewPhotosDir}/c4ec10bae129fa256a845edbaf358f9b.jpg`,
    text: "Понравилось, что никто не торопил с выбором формы. Мы спокойно обсудили мои пожелания, подобрали оттенок и несколько раз проверили эскиз. В итоге брови подходят именно моему лицу. Очень приятное впечатление от процедуры и общения!",
  },
  {
    name: "Ольга",
    service: "Обновление старого перманента",
    photo: `${reviewPhotosDir}/d37797b594c560abb87324856ed7d084.jpg`,
    text: "У меня остался старый перманент, который со временем приобрёл не тот оттенок. Боялась, что станет ещё хуже. Сначала отправила фото, мы обсудили возможные варианты, и только потом решили, что делать. Очень ценю такой внимательный подход без обещаний невозможного.",
  },
  {
    name: "Алина",
    service: "Перманент бровей",
    photo: `${reviewPhotosDir}/e6584992cf235ef0ea29146d7410e300.jpg`,
    text: "Наконец-то брови, которые не хочется закрашивать каждое утро! Получилось мягко, натурально и без лишней графичности. Спасибо за терпение и внимание к деталям ❤️",
  },
  {
    name: "Виктория",
    service: "Перманент бровей",
    photo: `${reviewPhotosDir}/e80d25d5bd4b7d298344e30998466414.jpg`,
    text: "Для меня было важно, чтобы результат не выглядел слишком ярким без макияжа. Мы выбрали подходящий оттенок, и мастер подробно рассказала, как будут меняться брови во время заживления. Теперь жду окончательного результата с удовольствием, а не с тревогой.",
  },
  {
    name: "Наталья",
    service: "Перманент бровей",
    photo: `${reviewPhotosDir}/f423d5a54fa814b7653d6dfa67db9c3e.jpg`,
    text: "Очень комфортная атмосфера, всё чисто и аккуратно. Перед процедурой обсудили форму, оттенок и мои пожелания. Ничего не навязывали, цена была понятна заранее. Для меня это большой плюс, обязательно буду рекомендовать знакомым.",
  },
  {
    name: "Дарья",
    service: "Перманент губ",
    photo: `${reviewPhotosDir}/fb679bbedad2dab707c36af6fd742e7e.jpg`,
    text: "Давно хотела освежить цвет губ, но не решалась. Результат выглядит деликатно и не перегружает лицо. Отдельное спасибо за подробные рекомендации по уходу и ответы на все мои вопросы.",
  },
];

type Layout = {
  xs: number[];
  lower: boolean[];
  drop: number;
  travel: number;
  phase1: number;
  phase2: number;
  total: number;
  cardW: number;
  count: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smooth(value: number) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

function chooseFrame(stageW: number) {
  const minCard = 150;
  const maxCard = 292;
  const minGap = 16;
  const maxGap = 72;

  let count = 2;
  let cardW = Math.min(maxCard, stageW);
  let fitted = false;
  for (const candidate of [5, 4, 3, 2]) {
    const width = Math.floor((stageW - minGap * (candidate - 1)) / candidate);
    if (width >= minCard) {
      count = candidate;
      cardW = Math.min(maxCard, width);
      fitted = true;
      break;
    }
  }

  if (!fitted) {
    const paired = Math.floor((stageW - minGap) / 2);
    count = 2;
    cardW = paired >= 132 ? paired : Math.min(maxCard, Math.max(148, stageW - minGap - 56));
  }

  let gap = minGap;
  if (count >= 5) {
    const spare = stageW - (count * cardW + (count - 1) * minGap);
    if (spare > 0) gap = minGap + Math.min(maxGap - minGap, Math.floor(spare / (count - 1)));
  }

  return { count, cardW, gap };
}

function buildLayout(stageW: number, cardW: number, cardH: number, gap: number, count: number, viewport: number): Layout {
  const pitch = cardW + gap;
  const xs = reviews.map((_, index) => index * pitch);
  const lower = reviews.map((_, index) => index < count && index % 2 === 1);
  const drop = Math.round(cardH * 0.75);
  const travel = Math.max(0, xs[reviews.length - 1] + cardW - stageW);
  const basePhase = drop < 12 ? 0 : Math.round(clamp(viewport * 0.52, 340, 640));
  const phase1 = basePhase === 0 ? 0 : Math.round(basePhase * (drop / (cardH * 0.5)));
  const phase2 = travel;
  return {
    xs,
    lower,
    drop,
    travel,
    phase1,
    phase2,
    total: phase1 + phase2,
    cardW,
    count,
  };
}

export function ReviewsSection() {
  const titleId = useId();
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const layoutRef = useRef<Layout | null>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const rail = railRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const swipe = window.matchMedia("(max-width: 900px)");
    let frame = 0;
    let measuredKey = "";

    const readHeights = () => cardRefs.current.map((card) => card?.offsetHeight ?? 0);

    const placeFollowers = (shift: number) => {
      const value = shift === 0 ? "" : `translate3d(0, ${Math.round(shift)}px, 0)`;
      let el = track.nextElementSibling;
      while (el) {
        if (el instanceof HTMLElement) el.style.transform = value;
        el = el.nextElementSibling;
      }
    };

    const clearMotion = () => {
      track.style.height = "";
      track.classList.add("is-reduced");
      track.classList.remove("is-swipe");
      stage.style.removeProperty("--card-w");
      stage.style.removeProperty("--card-h");
      stage.style.removeProperty("--stage-h");
      if (rail) {
        rail.style.transform = "";
        rail.style.width = "";
      }
      cardRefs.current.forEach((card) => {
        if (!card) return;
        card.style.transform = "";
      });
      placeFollowers(0);
      const height = Math.max(...readHeights(), 1);
      stage.style.setProperty("--card-h", `${height}px`);
    };

    const clearSwipe = () => {
      measuredKey = "";
      track.style.height = "";
      track.classList.remove("is-reduced");
      track.classList.add("is-swipe");
      stage.style.removeProperty("--card-w");
      stage.style.removeProperty("--card-h");
      stage.style.removeProperty("--stage-h");
      if (rail) {
        rail.style.transform = "";
        rail.style.width = "";
      }
      cardRefs.current.forEach((card) => {
        if (!card) return;
        card.style.transform = "";
      });
      placeFollowers(0);
      track.classList.add("is-ready");
    };

    const apply = () => {
      if (reduced.matches || swipe.matches || !rail) {
        placeFollowers(0);
        return;
      }
      const layout = layoutRef.current;
      if (!layout) return;
      const scrolled = clamp(-track.getBoundingClientRect().top, 0, layout.total);
      const rise = layout.phase1 <= 0 ? 1 : smooth(clamp(scrolled / layout.phase1, 0, 1));
      const shift = layout.phase2 <= 0 ? 0 : Math.max(0, scrolled - layout.phase1) * (layout.travel / layout.phase2);
      rail.style.transform = `translate3d(${-Math.round(shift)}px, 0, 0)`;
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const y = layout.lower[index] ? Math.round(layout.drop * (1 - rise)) : 0;
        card.style.transform = `translate3d(${layout.xs[index]}px, ${y}px, 0)`;
      });
      placeFollowers(0);
      track.classList.add("is-ready");
    };

    const measure = () => {
      if (reduced.matches) {
        measuredKey = "";
        clearMotion();
        return;
      }
      if (swipe.matches) {
        clearSwipe();
        return;
      }
      track.classList.remove("is-swipe");
      track.classList.remove("is-reduced");
      const stageW = stage.clientWidth;
      if (stageW < 40) return;
      const frameSize = chooseFrame(stageW);
      const key = `${stageW}:${frameSize.cardW}:${frameSize.count}`;
      if (key !== measuredKey) {
        stage.style.setProperty("--card-w", `${frameSize.cardW}px`);
        stage.style.removeProperty("--card-h");
        const natural = Math.max(...readHeights(), 1);
        stage.style.setProperty("--card-h", `${natural}px`);
        measuredKey = key;
      }
      const cardH = Math.max(...readHeights(), 1);
      const layout = buildLayout(
        stageW,
        frameSize.cardW,
        cardH,
        frameSize.gap,
        frameSize.count,
        window.innerHeight,
      );
      layoutRef.current = layout;
      stage.style.setProperty("--stage-h", `${cardH + layout.drop}px`);
      if (rail) rail.style.width = `${layout.xs[reviews.length - 1] + layout.cardW}px`;
      const pin = track.querySelector<HTMLElement>(".reviews__pin");
      track.style.height = `${(pin?.offsetHeight ?? 0) + layout.total}px`;
      apply();
    };

    const request = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        apply();
      });
    };

    let cancelled = false;
    measure();
    const observer = new ResizeObserver(() => {
      measure();
    });
    observer.observe(stage);
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", measure);
    reduced.addEventListener("change", measure);
    swipe.addEventListener("change", measure);
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      measuredKey = "";
      measure();
    });
    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", measure);
      reduced.removeEventListener("change", measure);
      swipe.removeEventListener("change", measure);
      if (frame) window.cancelAnimationFrame(frame);
      let el = track.nextElementSibling;
      while (el) {
        if (el instanceof HTMLElement) el.style.transform = "";
        el = el.nextElementSibling;
      }
    };
  }, []);

  return (
    <section className="reviews" id="reviews" ref={trackRef} aria-labelledby={titleId}>
      <div className="reviews__pin">
        <div className="container">
          <h2 className="reviews__title" id={titleId}>
            Когда результат — это вы
          </h2>
          <div className="reviews__stage" ref={stageRef}>
            <div className="reviews__rail" ref={railRef}>
              {reviews.map((review, index) => (
                <article
                  key={review.name}
                  className="reviews__card"
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                >
                  <div className="reviews__author">
                    <span className="reviews__avatar" aria-hidden="true">
                      {review.photo ? <img src={review.photo} alt="" /> : review.name.trim().charAt(0)}
                    </span>
                    <div className="reviews__person">
                      <h3 className="reviews__name">{review.name}</h3>
                      <p className="reviews__service">{review.service}</p>
                    </div>
                  </div>
                  <p className="reviews__text">{review.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
