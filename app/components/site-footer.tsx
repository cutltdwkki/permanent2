const email = "hello@lina-pm.example";

export function SiteFooter({
  phoneDisplay,
  phoneHref,
  whatsappHref,
}: {
  phoneDisplay: string;
  phoneHref: string;
  whatsappHref: string;
}) {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <nav className="site-footer__nav" aria-label="Навигация в подвале">
          <div className="site-footer__nav-side">
            <a href="#services">Услуги</a>
            <a href="#results">Работы</a>
          </div>
          <div className="site-footer__nav-side">
            <a href="#reviews">Отзывы</a>
            <a href="#faq">Вопросы</a>
          </div>
        </nav>

        <a className="logo site-footer__logo" href="/">
          <span className="logo__word">LINA</span>
          <span className="logo__pm">pm</span>
          <span className="logo__word">CODE</span>
        </a>

        <div className="site-footer__info">
          <div className="site-footer__contact">
            <p className="site-footer__label">Связаться с нами</p>
            <a className="site-footer__mail" href={`mailto:${email}`}>
              {email}
            </a>
            <div className="site-footer__phone-row">
              <a className="site-footer__phone" href={phoneHref}>
                {phoneDisplay}
              </a>
              <a
                className="site-footer__wa"
                href={whatsappHref}
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.04 3C7.31 3 3.48 6.83 3.48 11.56c0 1.5.4 2.96 1.15 4.24L3 21l5.34-1.4a8.53 8.53 0 0 0 3.7.85h.01c4.73 0 8.56-3.83 8.56-8.56C20.6 6.83 16.77 3 12.04 3zm4.96 12.13c-.2.58-1.18 1.1-1.64 1.17-.42.06-.96.09-1.55-.1-.36-.11-.82-.27-1.41-.53-2.48-1.07-4.1-3.57-4.22-3.74-.12-.17-1-1.33-1-2.54s.63-1.8.86-2.05c.22-.24.48-.3.64-.3h.46c.15 0 .34 0 .52.4.2.56.67 1.93.73 2.07.06.14.1.3.02.48-.08.17-.12.28-.24.43l-.36.42c-.12.12-.24.25-.1.49.14.24.62.99 1.33 1.61.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06l.62-.72c.16-.18.32-.15.54-.09l1.86.88c.22.1.36.16.42.25.05.08.05.5-.15 1.08z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="site-footer__address">
            <p className="site-footer__label">Наш адрес</p>
            <p className="site-footer__place">Казань, ул. Баумана, 00</p>
          </div>
        </div>

        <div className="site-footer__bar">
          <p className="site-footer__copy">© 2026 LINA pm CODE. Все права защищены.</p>
          <div className="site-footer__legal">
            {/* Страницы реквизитов пока нет — заменить span на ссылку, когда появится адрес. */}
            <span>Реквизиты</span>
            <a href="/privacy">Политика конфиденциальности</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
