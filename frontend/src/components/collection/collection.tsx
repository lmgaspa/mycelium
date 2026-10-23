"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, type Locale } from "@/app/auth/locale";
import styles from "./collection.module.css";

const slides = [
  { image: "floresmagicascolecao.webp", name: "Flores Mágicas" },
  { image: "raizcolecao.webp", name: "Raiz" },
  { image: "crescimentocolecaoa.webp", name: "Crescimento A" },
  { image: "crescimentobcolecao.webp", name: "Crescimento B" },
  { image: "floracaocolecaoa.webp", name: "Floração A" },
  { image: "floracaocolecaob.webp", name: "Floração B" },
  { image: "finalizadorcolecao.webp", name: "Finalizador" },
] as const;

const copy: Record<Locale, {
  eyebrow: string;
  heading: string;
  intro: string;
  carousel: string;
  previous: string;
  next: string;
  goTo: (name: string) => string;
  imageAlt: (name: string) => string;
}> = {
  pt: {
    eyebrow: "MYCELIUM · COLEÇÃO",
    heading: "Conheça nossa coleção",
    intro: "Explore cada linha Mycelium e encontre a próxima etapa do seu cultivo.",
    carousel: "Banners da coleção Mycelium",
    previous: "Banner anterior",
    next: "Próximo banner",
    goTo: (name) => `Ver banner ${name}`,
    imageAlt: (name) => `Produtos Mycelium da linha ${name}`,
  },
  en: {
    eyebrow: "MYCELIUM · COLLECTION",
    heading: "Explore our collection",
    intro: "Explore every Mycelium line and find the next step for your growing journey.",
    carousel: "Mycelium collection banners",
    previous: "Previous banner",
    next: "Next banner",
    goTo: (name) => `View ${name} banner`,
    imageAlt: (name) => `Mycelium ${name} products`,
  },
  es: {
    eyebrow: "MYCELIUM · COLECCIÓN",
    heading: "Descubre nuestra colección",
    intro: "Explora cada línea Mycelium y encuentra la próxima etapa de tu cultivo.",
    carousel: "Banners de la colección Mycelium",
    previous: "Banner anterior",
    next: "Banner siguiente",
    goTo: (name) => `Ver banner ${name}`,
    imageAlt: (name) => `Productos Mycelium de la línea ${name}`,
  },
};

export default function Collection({ embedded = false }: { embedded?: boolean }) {
  const locale = useLocale();
  const t = copy[locale];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || !pageVisible) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 3000);
    return () => window.clearInterval(timer);
  }, [active, paused, reducedMotion, pageVisible]);

  return (
    <div id={embedded ? "colecao" : undefined} className={`${styles.page} ${embedded ? styles.embedded : ""}`}>
      <div className={styles.shell}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>{t.eyebrow}</span>
          {embedded ? <h2>{t.heading}</h2> : <h1>{t.heading}</h1>}
          <p>{t.intro}</p>
        </div>

        <section
          className={styles.carousel}
          aria-label={t.carousel}
          aria-roledescription="carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
          }}
        >
          <div className={styles.stage}>
            {slides.map((slide, index) => (
              <Image
                key={slide.image}
                src={`/images/collecao/${slide.image}`}
                alt={t.imageAlt(slide.name)}
                fill
                sizes="(max-width: 760px) 100vw, 1180px"
                priority={index === 0}
                loading="eager"
                className={`${styles.slide} ${index === active ? styles.active : ""}`}
                aria-hidden={index !== active}
              />
            ))}
            <Button
              type="button"
              variant="secondary"
              size="icon-lg"
              className={`${styles.arrow} ${styles.previous}`}
              aria-label={t.previous}
              onClick={() => setActive((current) => (current - 1 + slides.length) % slides.length)}
            >
              <ArrowLeft aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon-lg"
              className={`${styles.arrow} ${styles.next}`}
              aria-label={t.next}
              onClick={() => setActive((current) => (current + 1) % slides.length)}
            >
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>

          <div className={styles.details}>
            <div className={styles.caption}>
              <span className={styles.counter}>{String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
              <h2>{slides[active].name}</h2>
            </div>
            <div className={styles.dots} aria-label={t.carousel}>
              {slides.map((slide, index) => (
                <Button
                  key={slide.image}
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className={`${styles.dotButton} ${index === active ? styles.selected : ""}`}
                  aria-label={t.goTo(slide.name)}
                  aria-current={index === active ? "true" : undefined}
                  onClick={() => setActive(index)}
                >
                  <span />
                </Button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
