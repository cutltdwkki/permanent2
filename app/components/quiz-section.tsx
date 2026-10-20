"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { useReveal } from "./use-reveal";

type Zone = "brows" | "lips" | "lashes" | "brows-lips" | "refresh" | "unsure";
type History = "first" | "update" | "fix";
type Worry = "pain" | "unnatural" | "color" | "shape" | "price" | "bad";
type Goal = "natural" | "noticeable" | "consult";
type Messenger = "whatsapp" | "telegram";

type Answers = {
  zone: Zone | null;
  history: History | null;
  worry: Worry | null;
  goal: Goal | null;
};

type Recommendation = {
  name: string;
  why: string;
  price: string | null;
  photoAsk: boolean;
  cta: string;
};

const emptyAnswers: Answers = {
  zone: null,
  history: null,
  worry: null,
  goal: null,
};

const photoSrc = `/pictures/${encodeURIComponent("квиз.png")}`;

const questions: {
  key: keyof Answers;
  title: string;
  options: { id: string; label: string }[];
}[] = [
  {
    key: "zone",
    title: "Что хотите сделать?",
    options: [
      { id: "brows", label: "Брови" },
      { id: "lips", label: "Губы" },
      { id: "lashes", label: "Межресничное пространство" },
      { id: "brows-lips", label: "Брови и губы" },
      { id: "refresh", label: "Обновить старый перманент" },
      { id: "unsure", label: "Пока не знаю" },
    ],
  },
  {
    key: "history",
    title: "Есть ли уже перманент?",
    options: [
      { id: "first", label: "Нет, делаю впервые" },
      { id: "update", label: "Есть, хочу обновить" },
      { id: "fix", label: "Есть, хочу исправить" },
    ],
  },
  {
    key: "worry",
    title: "Что беспокоит больше всего?",
    options: [
      { id: "pain", label: "Боль" },
      { id: "unnatural", label: "Неестественный вид" },
      { id: "color", label: "Цвет и оттенок" },
      { id: "shape", label: "Форма" },
      { id: "price", label: "Цена" },
      { id: "bad", label: "Неудачный прошлый опыт" },
    ],
  },
  {
    key: "goal",
    title: "Какой результат хотите?",
    options: [
      { id: "natural", label: "Максимально натуральный" },
      { id: "noticeable", label: "Заметный, но аккуратный" },
      { id: "consult", label: "Не знаю, нужна консультация" },
    ],
  },
];

const worryLine: Record<Worry, string> = {
  pain: "Боль снимаем анестезией с учётом ваших особенностей.",
  unnatural: "Форму соберём мягко, без жёстких контуров и чужого рисунка.",
  color: "Оттенок подберём по подтону кожи и тому, как пигмент будет выглядеть после заживления.",
  shape: "Форму прорисуем и согласуем с вами до процедуры.",
  price: "Стоимость назовём заранее, без скрытых доплат.",
  bad: "Неудачный опыт разберём до того, как мастер возьмёт аппарат.",
};

const goalLine: Record<Exclude<Goal, "consult">, string> = {
  natural: "Ориентир — максимально натуральный результат.",
  noticeable: "Сделаем заметно, но аккуратно.",
};

function zoneNote(zone: Zone) {
  if (zone === "brows") return "Речь про брови.";
  if (zone === "lips") return "Речь про губы.";
  if (zone === "lashes") return "Речь про межресничное пространство.";
  if (zone === "brows-lips") return "Речь про брови и губы.";
  return "";
}

function recommend(answers: Answers): Recommendation {
  const zone = answers.zone ?? "unsure";
  const history = answers.history ?? "first";
  const worry = answers.worry ?? "shape";
  const goal = answers.goal ?? "consult";
  const detail = [worryLine[worry], goal === "consult" ? "" : goalLine[goal]]
    .filter(Boolean)
    .join(" ");

  if (history === "fix") {
    return {
      name: "Консультация",
      why: `Сначала оценим текущий перманент и на консультации решим, что можно исправить. Процедуру не назначаем, пока мастер не увидит работу. ${worryLine[worry]}`,
      price: null,
      photoAsk: false,
      cta: "Записаться на консультацию",
    };
  }

  if (zone === "refresh" || history === "update") {
    const about = zoneNote(zone);
    return {
      name: "LINA Refresh",
      why: `Старый перманент лучше обновить по фото, а не перекрывать наугад. ${about} Мастер оценит зону и скажет, как её освежить. ${detail}`.replace(
        /\s+/g,
        " ",
      ),
      price: "12\u00a0000",
      photoAsk: true,
      cta: "Отправить фото старого перманента",
    };
  }

  if (zone === "lashes") {
    return {
      name: "Консультация",
      why: `Отдельной процедуры только для межресничного пространства в студии нет. На консультации посмотрим, нужен ли этот акцент и в каком объёме. ${worryLine[worry]}`,
      price: null,
      photoAsk: false,
      cta: "Записаться на консультацию",
    };
  }

  if (zone === "unsure" || goal === "consult") {
    const lead =
      zone === "unsure"
        ? "По ответам рано назначать процедуру. Начнём с консультации: разберём задачу и предложим подходящий вариант."
        : "Вы хотите определиться вместе с мастером. Начнём с консультации, без записи на процедуру вслепую.";
    return {
      name: "Консультация",
      why: `${lead} ${worryLine[worry]}`,
      price: null,
      photoAsk: false,
      cta: "Записаться на консультацию",
    };
  }

  if (zone === "brows-lips") {
    return {
      name: "Signature Look",
      why: `Брови и губы за один визит собираются в Signature Look: одна палитра и цельный образ. ${detail}`,
      price: "48\u00a0000",
      photoAsk: false,
      cta: "Записаться",
    };
  }

  if (zone === "lips") {
    return {
      name: "Soft Lips",
      why: `Для губ подойдёт Soft Lips: акварельный оттенок и мягкий контур. ${detail}`,
      price: "18\u00a0000",
      photoAsk: false,
      cta: "Записаться",
    };
  }

  return {
    name: "Brow Reset",
    why: `Брови с нуля — это Brow Reset: форма и естественный цвет, которые выглядят своими и сразу, и после заживления. ${detail}`,
    price: "22\u00a0000",
    photoAsk: false,
    cta: "Записаться",
  };
}

function answerLabel(answers: Answers, key: keyof Answers) {
  const question = questions.find((item) => item.key === key);
  const value = answers[key];
  return question?.options.find((option) => option.id === value)?.label ?? "";
}

function RadioMark() {
  return (
    <span className="quiz__radio" aria-hidden="true">
      <svg viewBox="0 0 16 16">
        <path d="M3.2 8.2 6.3 11.2 12.8 4.6" />
      </svg>
    </span>
  );
}

function formatPhone(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  if (digits.startsWith("7")) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (!digits) return "";
  const area = digits.slice(0, 3);
  const first = digits.slice(3, 6);
  const second = digits.slice(6, 8);
  const third = digits.slice(8, 10);
  let formatted = `+7 (${area}`;
  if (area.length < 3) return formatted;
  formatted += `) ${first}`;
  if (first.length < 3) return formatted;
  formatted += ` ${second}`;
  if (second.length < 2) return formatted;
  formatted += `-${third}`;
  return formatted;
}

export function QuizSection({ whatsappHref }: { whatsappHref: string }) {
  const titleId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const [blockMin, setBlockMin] = useState(0);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [messenger, setMessenger] = useState<Messenger>("whatsapp");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [handoff, setHandoff] = useState<"opened" | "telegram" | null>(null);

  useReveal(sectionRef);

  const recommendation = recommend(answers);
  const progress = step >= 4 ? 1 : (step + 1) / questions.length;
  const shortStep = step < 4 ? `${String(step + 1).padStart(2, "0")} / 04` : step === 4 ? "Результат" : "Готово";
  const longStep =
    step < 4 ? `Вопрос ${step + 1} из 4` : step === 4 ? "Результат" : "Ваша рекомендация";

  useLayoutEffect(() => {
    const copy = copyRef.current;
    if (!copy) return;
    const apply = () => {
      if (window.innerWidth <= 900) {
        setBlockMin(0);
        return;
      }
      if (step !== 0) return;
      const next = copy.scrollHeight;
      setBlockMin((current) => (current === next ? current : next));
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(copy);
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [step]);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const node = headingRef.current;
    if (!node) return;
    node.focus({ preventScroll: true });
    if (window.innerWidth > 900) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, [step]);

  function choose(key: keyof Answers, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function back() {
    setStep((current) => Math.max(0, current - 1));
  }

  function forward() {
    const current = questions[step];
    if (!current || !answers[current.key]) return;
    setStep((value) => value + 1);
  }

  function restart() {
    setAnswers(emptyAnswers);
    setName("");
    setPhone("");
    setMessenger("whatsapp");
    setConsent(false);
    setErrors({});
    setHandoff(null);
    setStep(0);
  }

  function draftText() {
    const lines = [
      "Здравствуйте! Прошла квиз на сайте и хочу рекомендацию.",
      `Имя: ${name.trim()}`,
      `Телефон: ${phone.trim()}`,
      `Мессенджер: ${messenger === "telegram" ? "Telegram" : "WhatsApp"}`,
      `Что хотите сделать: ${answerLabel(answers, "zone")}`,
      `Перманент: ${answerLabel(answers, "history")}`,
      `Беспокоит: ${answerLabel(answers, "worry")}`,
      `Результат: ${answerLabel(answers, "goal")}`,
      `Рекомендация: ${recommendation.name}`,
    ];
    if (recommendation.photoAsk) {
      lines.push("Фото старого перманента отправлю следующим сообщением.");
    }
    return lines.join("\n");
  }

  function openWhatsapp(text: string) {
    const base = whatsappHref.split("?")[0];
    const popup = window.open(
      `${base}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    return Boolean(popup);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Record<string, string> = {};
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      next.name = trimmed ? "Имя слишком короткое" : "Напишите, как к вам обращаться";
    }
    const digits = phone.replace(/\D/g, "").replace(/^[78]/, "");
    if (!phone.trim()) next.phone = "Введите номер телефона";
    else if (digits.length !== 10) next.phone = "Введите номер в формате +7 (900) 000 00-00";
    if (!consent) next.consent = "Нужно согласие на обработку персональных данных";
    setErrors(next);
    if (Object.keys(next).length) return;

    if (messenger === "telegram") {
      setHandoff("telegram");
    } else {
      openWhatsapp(draftText());
      setHandoff("opened");
    }
    setStep(5);
  }

  const question = step < 4 ? questions[step] : null;

  return (
    <section className="quiz" id="quiz" ref={sectionRef} aria-labelledby={titleId}>
      <div className="container quiz__layout">
        <div
          className="quiz__copy"
          ref={copyRef}
          style={blockMin > 0 ? { minHeight: blockMin } : undefined}
        >
          <div className="quiz__meta">
            <p className="quiz__kicker">
              <span>Квиз</span>
              <span className="quiz__kicker-long">{longStep}</span>
              <span className="quiz__kicker-short">{shortStep}</span>
            </p>
            <div
              className="quiz__bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              aria-label={longStep}
            >
              <span style={{ width: `${progress * 100}%` }} />
            </div>
          </div>

          {step === 0 ? (
            <div className="quiz__intro">
              <h2 className="quiz__title">Подберём услугу за 1 минуту</h2>
              <p className="quiz__subtitle">
                4 вопроса — и вы узнаете, какая процедура вам подойдёт и сколько она стоит.
              </p>
            </div>
          ) : null}

          <div className="quiz__stage" key={step}>
            {question ? (
              <>
                <h3 className="quiz__question" id={titleId} tabIndex={-1} ref={headingRef}>
                  {question.title}
                </h3>
                <div className="quiz__options" role="radiogroup" aria-labelledby={titleId}>
                  {question.options.map((option) => {
                    const selected = answers[question.key] === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={selected ? "quiz__option is-selected" : "quiz__option"}
                        role="radio"
                        aria-checked={selected}
                        onClick={() => choose(question.key, option.id)}
                      >
                        <RadioMark />
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="quiz__nav">
                  {step > 0 ? (
                    <button type="button" className="quiz__back" onClick={back}>
                      Назад
                    </button>
                  ) : (
                    <span />
                  )}
                  <button
                    type="button"
                    className="btn btn--accent btn--compact quiz__next"
                    onClick={forward}
                    disabled={!answers[question.key]}
                  >
                    Далее
                  </button>
                </div>
              </>
            ) : null}

            {step === 4 ? (
              <form className="quiz__form" onSubmit={submit} noValidate>
                <h3 className="quiz__question" id={titleId} tabIndex={-1} ref={headingRef}>
                  Куда прислать рекомендацию?
                </h3>
                <label className="quiz__field" htmlFor="quiz-name">
                  Имя
                  <input
                    id="quiz-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "quiz-name-error" : undefined}
                    onChange={(event) => {
                      setName(event.target.value);
                      setErrors((current) => ({ ...current, name: "" }));
                    }}
                  />
                  {errors.name ? (
                    <span className="quiz__error" id="quiz-name-error">
                      {errors.name}
                    </span>
                  ) : null}
                </label>
                <label className="quiz__field" htmlFor="quiz-phone">
                  Номер телефона
                  <input
                    id="quiz-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+7 (900) 000 00-00"
                    value={phone}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "quiz-phone-error" : undefined}
                    onChange={(event) => {
                      setPhone(formatPhone(event.target.value));
                      setErrors((current) => ({ ...current, phone: "" }));
                    }}
                  />
                  {errors.phone ? (
                    <span className="quiz__error" id="quiz-phone-error">
                      {errors.phone}
                    </span>
                  ) : null}
                </label>
                <div className="quiz__field">
                  <span id="quiz-messenger">Предпочтительный мессенджер</span>
                  <div className="quiz__options" role="radiogroup" aria-labelledby="quiz-messenger">
                    <button
                      type="button"
                      className={messenger === "whatsapp" ? "quiz__option is-selected" : "quiz__option"}
                      role="radio"
                      aria-checked={messenger === "whatsapp"}
                      onClick={() => setMessenger("whatsapp")}
                    >
                      <RadioMark />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      className={messenger === "telegram" ? "quiz__option is-selected" : "quiz__option"}
                      role="radio"
                      aria-checked={messenger === "telegram"}
                      onClick={() => setMessenger("telegram")}
                    >
                      <RadioMark />
                      <span>Telegram</span>
                    </button>
                  </div>
                </div>
                <label className="quiz__consent">
                  <input
                    type="checkbox"
                    checked={consent}
                    aria-invalid={Boolean(errors.consent)}
                    onChange={(event) => {
                      setConsent(event.target.checked);
                      setErrors((current) => ({ ...current, consent: "" }));
                    }}
                  />
                  <span>
                    Соглашаюсь на обработку персональных данных, чтобы студия могла связаться со мной
                    по заявке.
                  </span>
                </label>
                {errors.consent ? <p className="quiz__error">{errors.consent}</p> : null}
                <div className="quiz__nav">
                  <button type="button" className="quiz__back" onClick={back}>
                    Назад
                  </button>
                  <button className="btn btn--accent btn--compact quiz__next" type="submit">
                    {messenger === "telegram"
                      ? "Получить рекомендацию в Telegram"
                      : "Получить рекомендацию в WhatsApp"}
                  </button>
                </div>
              </form>
            ) : null}

            {step === 5 ? (
              <div className="quiz__result">
                <p className="quiz__eyebrow">Ваша рекомендация</p>
                <h3 className="quiz__question" id={titleId} tabIndex={-1} ref={headingRef}>
                  {recommendation.name}
                </h3>
                <p className="quiz__why">{recommendation.why}</p>
                <p className="quiz__price">
                  {recommendation.price
                    ? `от ${recommendation.price} ₽`
                    : "Стоимость уточним на консультации"}
                </p>
                {recommendation.photoAsk ? (
                  <p className="quiz__note">
                    Пришлите фото старого перманента — по нему мастер оценит, что можно обновить.
                  </p>
                ) : null}
                {handoff === "telegram" ? (
                  <p className="quiz__note">
                    Отправка в Telegram ещё не подключена. Рекомендацию можно отправить мастеру в
                    WhatsApp — это единственный подключённый канал.
                  </p>
                ) : null}
                {handoff === "opened" ? (
                  <p className="quiz__note">
                    Черновик открыт в WhatsApp. Осталось нажать «Отправить» в чате.
                  </p>
                ) : null}
                {recommendation.photoAsk ? (
                  <button
                    type="button"
                    className="btn btn--accent btn--compact quiz__submit"
                    onClick={() => {
                      openWhatsapp(draftText());
                      setHandoff("opened");
                    }}
                  >
                    {recommendation.cta}
                  </button>
                ) : (
                  <a className="btn btn--accent btn--compact quiz__submit" href="#booking">
                    {recommendation.cta}
                  </a>
                )}
                <div className="quiz__again">
                  <button type="button" className="quiz__text" onClick={() => setStep(3)}>
                    Вернуться к ответам
                  </button>
                  <button type="button" className="quiz__text" onClick={restart}>
                    Пройти ещё раз
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <figure className="quiz__visual">
          <img
            src={photoSrc}
            alt="Кабинет студии: кресло, светлые полки и красные акценты"
          />
        </figure>
      </div>
    </section>
  );
}
