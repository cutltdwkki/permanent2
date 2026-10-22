import { ApplySection } from "./components/apply-section";
import { FaqSection } from "./components/faq-section";
import { FamiliarSection } from "./components/familiar-section";
import { PromoSection } from "./components/promo-section";
import { QuizSection } from "./components/quiz-section";
import { ResultsSection } from "./components/results-section";
import { ReviewsSection } from "./components/reviews-section";
import { ServicesSection } from "./components/services-section";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";

const phoneDisplay = "+7 (900) 000-00-00";
const phoneHref = "tel:+79000000000";
const whatsappHref = "https://wa.me/79000000000";

export default function Home() {
  return (
    <>
      <SiteHeader phoneDisplay={phoneDisplay} phoneHref={phoneHref} />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__media" aria-hidden="true">
            <img
              className="hero__photo"
              src="/pictures/хиро.png?v=3"
              alt=""
            />
          </div>

          <div className="container hero__content">
            <h1 className="hero__title" id="hero-title">
              <span className="hero__title-line">
                <span className="hero__title-thin">Брови как ваши —</span>
              </span>
              <span className="hero__title-line">
                <span className="hero__title-strong">сразу и после</span>
              </span>
              <span className="hero__title-line">
                <span className="hero__title-strong">заживления</span>
              </span>
            </h1>

            <div className="hero__row">
              <div className="hero__contacts">
                <a className="hero__phone" href={phoneHref}>
                  {phoneDisplay}
                </a>
                <a
                  className="hero__wa"
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

              <div className="hero__aside">
                <ul className="hero__perks">
                  <li>Анестезия</li>
                  <li>Эскиз в цене</li>
                  <li>Сопровождение в заживлении</li>
                </ul>
                <p className="hero__lead">
                  Анализ лица, подбор оттенка и предварительная прорисовка до
                  того, как мастер возьмёт аппарат.
                </p>
                <div className="hero__actions">
                  <a className="btn btn--light" href="#form">
                    Записаться на консультацию
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ServicesSection whatsappHref={whatsappHref} />
        <FamiliarSection />
        <QuizSection whatsappHref={whatsappHref} />
        <ResultsSection />
        <ReviewsSection />
        <PromoSection />
        <FaqSection whatsappHref={whatsappHref} />
        <ApplySection whatsappHref={whatsappHref} />
      </main>
      <SiteFooter
        phoneDisplay={phoneDisplay}
        phoneHref={phoneHref}
        whatsappHref={whatsappHref}
      />
    </>
  );
}
