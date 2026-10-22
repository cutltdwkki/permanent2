"use client";

import { useId, useState } from "react";

const items = [
  {
    question: "Больно ли делать перманент?",
    answer:
      "Обычно процедура ощущается как лёгкое покалывание или царапание. Использую анестезию, чтобы сделать процесс комфортнее. Чувствительность индивидуальна.",
  },
  {
    question: "Сколько заживают брови?",
    answer:
      "7–14 дней — обычно столько занимает поверхностное заживление. Цвет сначала может казаться ярче, затем становится мягче. Окончательный результат оцениваем после восстановления кожи.",
  },
  {
    question: "Как долго держится перманент?",
    answer:
      "1–2 года — примерный срок сохранения пигмента. Он зависит от типа кожи, особенностей организма, ухода и образа жизни. Постепенно цвет светлеет.",
  },
  {
    question: "Нужна ли коррекция и чем она отличается от рефреша?",
    answer:
      "Да, коррекция может понадобиться после заживления, чтобы выровнять оттенок и заполнить участки, где пигмент закрепился слабее. Рефреш — обновление уже существующего перманента, когда цвет со временем побледнел.",
  },
  {
    question: "Можно ли обновить старый перманент?",
    answer:
      "Да, если состояние и оттенок старого пигмента позволяют это сделать. Сначала оценим брови по фото, а при необходимости обсудим другие варианты коррекции.",
  },
  {
    question: "Есть ли противопоказания?",
    answer:
      "Да, некоторые состояния кожи, заболевания и периоды восстановления могут быть противопоказаниями. Перед процедурой обязательна консультация: возможность проведения оцениваем индивидуально, при необходимости — с врачом.",
  },
  {
    question: "Что входит в стоимость?",
    answer:
      "Эскиз, подбор формы и оттенка, анестезия и рекомендации по уходу уже включены в стоимость. Цена согласовывается заранее, без неожиданных доплат.",
  },
  {
    question: "Можно ли выйти на работу после процедуры?",
    answer:
      "Да, но в первые дни цвет может быть ярче привычного, а кожа — слегка покрасневшей. Если у вас важное мероприятие, лучше запланировать процедуру заранее, оставив время на заживление.",
  },
];

export function FaqSection({ whatsappHref }: { whatsappHref: string }) {
  const titleId = useId();
  const [open, setOpen] = useState(-1);
  const chatHref = `${whatsappHref.split("?")[0]}?text=${encodeURIComponent("Здравствуйте! У меня вопрос по перманенту.")}`;

  return (
    <section className="faq" id="faq" aria-labelledby={titleId}>
      <div className="container faq__grid">
        <div className="faq__list">
          {items.map((item, index) => {
            const isOpen = open === index;
            const panelId = `${titleId}-panel-${index}`;
            const buttonId = `${titleId}-q-${index}`;
            return (
              <div className={isOpen ? "faq__item is-open" : "faq__item"} key={item.question}>
                <h3 className="faq__heading">
                  <button
                    type="button"
                    id={buttonId}
                    className="faq__question"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : index)}
                  >
                    <span className="faq__mark" aria-hidden="true" />
                    <span>{item.question}</span>
                  </button>
                </h3>
                <div
                  className="faq__panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={isOpen ? undefined : true}
                >
                  <div className="faq__panel-inner">
                    <p className="faq__answer">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <a className="faq__ask" href={chatHref} target="_blank" rel="noopener noreferrer">
            Не нашли ответ? Спросите в WhatsApp
          </a>
        </div>
        <div className="faq__aside">
          <h2 className="faq__title" id={titleId}>
            Часто
            <br />
            задаваемые
            <br />
            вопросы
          </h2>
          <p className="faq__note">Отвечаю на вопросы, чтобы вам было спокойнее.</p>
        </div>
      </div>
    </section>
  );
}
