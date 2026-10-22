"use client";

import { FormEvent, useId, useRef, useState } from "react";
import {
  applyOffer,
  formatRub,
  offerIsVisible,
  primaryApplyLabel,
} from "../apply-config";

type Channel = "whatsapp" | "telegram" | "phone";
type Status = "draft" | "blocked" | "telegram" | "phone" | null;

const channels: { id: Channel; label: string }[] = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "telegram", label: "Telegram" },
  { id: "phone", label: "Телефонный звонок" },
];

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
  formatted += `-${second}`;
  if (second.length < 2) return formatted;
  formatted += `-${third}`;
  return formatted;
}

function phoneDigits(value: string) {
  return value.replace(/\D/g, "").replace(/^[78]/, "");
}

function channelLabel(channel: Channel) {
  return channels.find((item) => item.id === channel)?.label ?? channel;
}

function leadText(input: {
  name: string;
  phone: string;
  channel: Channel;
  messengerContact: string;
}) {
  const lines = [
    "Здравствуйте! Хочу оставить заявку с сайта.",
    `Имя: ${input.name}`,
    `Телефон: ${input.phone}`,
    `Удобнее связаться: ${channelLabel(input.channel)}`,
  ];
  if (input.channel === "telegram") lines.push(`Telegram: ${input.messengerContact}`);
  if (input.channel === "whatsapp" && input.messengerContact) {
    lines.push(`WhatsApp: ${input.messengerContact}`);
  }
  if (input.channel === "whatsapp" && !input.messengerContact) {
    lines.push("WhatsApp: на номер телефона выше.");
  }
  if (offerIsVisible()) {
    lines.push(
      `Интересует ${applyOffer.service.toLowerCase()}: ${formatRub(applyOffer.specialPriceRub)} вместо ${formatRub(applyOffer.regularPriceRub)}.`,
    );
    lines.push("Прошу подтвердить условия. Место не считаю забронированным.");
  }
  return lines.join("\n");
}

function openWhatsapp(whatsappHref: string, text: string) {
  const base = whatsappHref.split("?")[0];
  const popup = window.open(
    `${base}?text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener,noreferrer",
  );
  return Boolean(popup);
}

export function ApplySection({ whatsappHref }: { whatsappHref: string }) {
  const titleId = useId();
  const channelId = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState<Channel | "">("");
  const [messengerContact, setMessengerContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const pendingRef = useRef(false);

  const submitLabel = primaryApplyLabel();

  function validate(nextChannel = channel, nextContact = messengerContact) {
    const next: Record<string, string> = {};
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      next.name = trimmed ? "Имя слишком короткое" : "Напишите, как к вам обращаться";
    }
    const digits = phoneDigits(phone);
    if (!phone.trim()) next.phone = "Введите номер телефона";
    else if (digits.length !== 10) next.phone = "Введите номер полностью: +7 (___) ___-__-__";
    if (!nextChannel) next.channel = "Выберите, как с вами связаться";
    if (nextChannel === "telegram" && nextContact.trim().length < 2) {
      next.contact = "Укажите контакт в Telegram. Номер телефона сюда не подставляется";
    }
    if (!consent) next.consent = "Нужно согласие на обработку персональных данных";
    return next;
  }

  function payload() {
    return {
      name: name.trim(),
      phone: phone.trim(),
      channel: channel as Channel,
      messengerContact: messengerContact.trim(),
    };
  }

  function deliver(target: Channel) {
    if (target !== "whatsapp") {
      setStatus(target);
      return;
    }
    const opened = openWhatsapp(whatsappHref, leadText(payload()));
    setStatus(opened ? "draft" : "blocked");
  }

  function lock() {
    if (pendingRef.current) return false;
    pendingRef.current = true;
    setPending(true);
    return true;
  }

  function unlock() {
    pendingRef.current = false;
    setPending(false);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lock()) return;
    const next = validate();
    setErrors(next);
    const invalid = Object.keys(next)[0];
    if (invalid) {
      event.currentTarget.querySelector<HTMLElement>(`[data-field="${invalid}"]`)?.focus();
      unlock();
      return;
    }
    deliver(channel as Channel);
    unlock();
  }

  function openDraft() {
    if (!lock()) return;
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) {
      unlock();
      return;
    }
    const opened = openWhatsapp(whatsappHref, leadText(payload()));
    setStatus(opened ? "draft" : "blocked");
    unlock();
  }

  return (
    <section className="apply" id="form" aria-labelledby={titleId}>
      <div className="container apply__grid">
        <div className="apply__copy">
          <h2 className="apply__title" id={titleId}>
            Доверьте нам
            <br />
            вашу красоту
          </h2>
          <p className="apply__promise">Покажем форму бровей до процедуры</p>
        </div>

        <form className="apply__form" onSubmit={onSubmit} noValidate>
          <div className="apply__row">
            <label className="apply__field" htmlFor={`${titleId}-name`}>
              Имя
              <input
                id={`${titleId}-name`}
                data-field="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Ваше имя"
                value={name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? `${titleId}-name-error` : undefined}
                onChange={(event) => {
                  setName(event.target.value);
                  setErrors((current) => ({ ...current, name: "" }));
                }}
              />
              {errors.name ? (
                <span className="apply__error" id={`${titleId}-name-error`}>
                  {errors.name}
                </span>
              ) : null}
            </label>
            <label className="apply__field" htmlFor={`${titleId}-phone`}>
              Телефон
              <input
                id={`${titleId}-phone`}
                data-field="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? `${titleId}-phone-error` : undefined}
                onChange={(event) => {
                  setPhone(formatPhone(event.target.value));
                  setErrors((current) => ({ ...current, phone: "" }));
                }}
              />
              {errors.phone ? (
                <span className="apply__error" id={`${titleId}-phone-error`}>
                  {errors.phone}
                </span>
              ) : null}
            </label>
          </div>

          <fieldset className="apply__channels">
            <legend id={channelId}>Предпочтительный способ связи</legend>
            <div
              className="apply__choices"
              role="radiogroup"
              aria-labelledby={channelId}
              aria-describedby={errors.channel ? `${titleId}-channel-error` : undefined}
            >
              {channels.map((item) => (
                <label className={channel === item.id ? "apply__choice is-selected" : "apply__choice"} key={item.id}>
                  <input
                    data-field={item.id === "whatsapp" ? "channel" : undefined}
                    type="radio"
                    name="channel"
                    value={item.id}
                    checked={channel === item.id}
                    onChange={() => {
                      setChannel(item.id);
                      setMessengerContact("");
                      setErrors((current) => ({ ...current, channel: "", contact: "" }));
                    }}
                  />
                  {item.label}
                </label>
              ))}
            </div>
            {errors.channel ? (
              <span className="apply__error" id={`${titleId}-channel-error`}>
                {errors.channel}
              </span>
            ) : null}
          </fieldset>

          {channel === "whatsapp" || channel === "telegram" ? (
            <label className="apply__field" htmlFor={`${titleId}-contact`}>
              {channel === "telegram" ? "Контакт в Telegram" : "WhatsApp, если он отличается от телефона"}
              <input
                id={`${titleId}-contact`}
                data-field="contact"
                name="messenger"
                type="text"
                autoComplete="off"
                placeholder={channel === "telegram" ? "@username" : "Другой номер или оставьте пустым"}
                value={messengerContact}
                aria-invalid={Boolean(errors.contact)}
                aria-describedby={errors.contact ? `${titleId}-contact-error` : undefined}
                onChange={(event) => {
                  setMessengerContact(event.target.value);
                  setErrors((current) => ({ ...current, contact: "" }));
                }}
              />
              {errors.contact ? (
                <span className="apply__error" id={`${titleId}-contact-error`}>
                  {errors.contact}
                </span>
              ) : null}
            </label>
          ) : null}

          {applyOffer.showResponseText ? <p className="apply__note">{applyOffer.responseText}</p> : null}

          <div className="apply__actions">
            <button className="apply__submit" type="submit" disabled={pending} aria-busy={pending}>
              {submitLabel}
            </button>
            <a className="apply__consult" href="#booking">
              {applyOffer.secondaryLabel}
            </a>
          </div>

          <div className="apply__consent">
            <input
              id={`${titleId}-consent`}
              data-field="consent"
              type="checkbox"
              checked={consent}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? `${titleId}-consent-error` : undefined}
              onChange={(event) => {
                setConsent(event.target.checked);
                setErrors((current) => ({ ...current, consent: "" }));
              }}
            />
            <label htmlFor={`${titleId}-consent`}>
              Нажимая на кнопку, вы даёте согласие на обработку персональных данных и соглашаетесь с{" "}
              <a href={applyOffer.privacyHref}>политикой конфиденциальности</a>.
            </label>
          </div>
          {errors.consent ? (
            <p className="apply__error" id={`${titleId}-consent-error`}>
              {errors.consent}
            </p>
          ) : null}

          {status === "draft" ? (
            <p className="apply__status" role="status">
              Черновик открыт в WhatsApp. Осталось отправить его в чате. Место не забронировано.
            </p>
          ) : null}
          {status === "blocked" ? (
            <p className="apply__status" role="status">
              Браузер заблокировал окно WhatsApp. Разрешите всплывающие окна и повторите. Данные в форме сохранены.
            </p>
          ) : null}
          {status === "telegram" ? (
            <p className="apply__status" role="status">
              Заявка в Telegram не отправлена: этот канал ещё не подключён. Данные в форме сохранены.
            </p>
          ) : null}
          {status === "phone" ? (
            <p className="apply__status" role="status">
              Заявка на звонок не отправлена: серверный приём заявок ещё не подключён. Данные в форме сохранены.
            </p>
          ) : null}
          {status === "telegram" || status === "phone" ? (
            <button className="apply__draft" type="button" onClick={openDraft} disabled={pending}>
              Открыть черновик в WhatsApp
            </button>
          ) : null}
        </form>
      </div>
    </section>
  );
}
