/**
 * Заявка и спецпредложение.
 *
 * Перед публикацией замените демонстрационные значения ниже.
 * Не записывайте сюда реальные брони: этот объект не связан с учётом мест.
 *
 * status
 * - "demo" — условия на сайте демонстрационные, это не действующая акция;
 * - "live" — только после того, как цены, подарок, дата и места подтверждены;
 * - "hidden" — блок предложения скрыт, форма остаётся.
 *
 * showResponseText поставьте в false, если срок ответа не подтверждён.
 * Номер WhatsApp здесь не задаётся: он берётся из whatsappHref в app/page.tsx.
 *
 * Приём заявок на сервере не подключён. Сейчас доставляется только черновик
 * WhatsApp — тот же способ, что у диалога записи и квиза. Место при этом
 * не резервируется. Чтобы принимать заявки у себя, замените отправку
 * в apply-section.tsx и храните ключи на сервере, не в этом файле.
 */
export const applyOffer = {
  status: "demo" as "demo" | "live" | "hidden",
  service: "Перманентный макияж бровей",
  /** Обычная цена, ₽. */
  regularPriceRub: 8000,
  /** Специальная цена, ₽. */
  specialPriceRub: 5900,
  gift: "уходовый набор для бровей",
  /** Дата окончания акции, ГГГГ-ММ-ДД. */
  endsOn: "2026-11-30",
  /** Сколько мест заявлено в условиях. */
  seatsTotal: 20,
  /**
   * Демонстрационный остаток для подписи «Осталось N из M».
   * Компонент это число не уменьшает.
   */
  seatsRemaining: 20,
  responseText: "Ответим в течение 15 минут в рабочее время",
  showResponseText: true,
  privacyHref: "/privacy",
  primaryLabel: "Закрепить место по спеццене",
  primaryLabelPlain: "Оставить заявку",
  secondaryLabel: "Получить консультацию",
};

const months = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

export function formatRub(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)}\u00a0₽`;
}

export function formatOfferDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  const name = months[(month || 1) - 1] ?? "";
  return `${day} ${name} ${year} года`;
}

export function offerIsVisible(offer: typeof applyOffer = applyOffer) {
  return offer.status !== "hidden";
}

export function primaryApplyLabel(offer: typeof applyOffer = applyOffer) {
  return offerIsVisible(offer) ? offer.primaryLabel : offer.primaryLabelPlain;
}
