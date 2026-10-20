"use client";

import { useId, useLayoutEffect, useRef } from "react";
import { useReveal } from "./use-reveal";

const mediaDir = `/pictures/${encodeURIComponent("блок боли")}`;
const portraitSrc = `${mediaDir}/${encodeURIComponent("closeup-attractive-woman-with-natural-make-up-grey-wall.jpg")}`;
const videoSrc = `${mediaDir}/${encodeURIComponent("видео.MP4")}`;

const points = [
  {
    question: "Больно?",
    note: "Делаем процедуру комфортнее с помощью анестезии с учётом индивидуальных особенностей.",
  },
  {
    question: "Синие или рыжие?",
    note: "Учитываем подтон кожи и возможное осветление пигмента после заживления.",
  },
  {
    question: "Нарисованные?",
    note: "Подбираем мягкое исполнение без жёстких контуров и излишней графичности.",
  },
  {
    question: "Как у всех?",
    note: "Предварительно прорисовываем форму и согласуем её с вами до процедуры.",
  },
  {
    question: "Был неудачный опыт?",
    note: "Сначала оцениваем существующий перманент и обсуждаем возможные варианты коррекции или обновления.",
  },
  {
    question: "Доплаты?",
    note: "До процедуры согласуем стоимость, чтобы вы заранее понимали, за что платите.",
  },
];

function Point({ question, note }: { question: string; note: string }) {
  return (
    <article className="familiar__item">
      <p className="familiar__question">{question}</p>
      <p className="familiar__note">{note}</p>
    </article>
  );
}

export function FamiliarSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleId = useId();

  useReveal(sectionRef);

  useLayoutEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      if (reduced.matches) {
        node.style.setProperty("--shift", "1");
        return;
      }
      const rect = node.getBoundingClientRect();
      const start = window.innerHeight * 0.9;
      const end = window.innerHeight * 0.32;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      node.style.setProperty("--shift", progress.toFixed(4));
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
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      reduced.removeEventListener("change", request);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (reduced.matches) video.pause();
      else video.play().catch(() => {});
    };
    sync();
    reduced.addEventListener("change", sync);
    return () => reduced.removeEventListener("change", sync);
  }, []);

  return (
    <section
      className="familiar"
      id="familiar"
      ref={sectionRef}
      aria-labelledby={titleId}
    >
      <div className="container familiar__board">
        <h2 className="familiar__title" id={titleId}>
          Знакомо?
        </h2>

        <div className="familiar__col familiar__col--lead">
          <Point {...points[0]} />

          <figure className="familiar__media familiar__shot">
            <video
              ref={videoRef}
              className="familiar__video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Фрагмент процедуры перманентного макияжа"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          </figure>
        </div>

        <div className="familiar__main">
          <figure className="familiar__media familiar__portrait">
            <img
              src={portraitSrc}
              alt="Девушка с естественными бровями и мягким макияжем"
            />
          </figure>

          <div className="familiar__col">
            {points.slice(1).map((point) => (
              <Point key={point.question} {...point} />
            ))}
            <a className="btn btn--accent btn--compact familiar__action" href="#booking">
              Обсудить своё с мастером
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
