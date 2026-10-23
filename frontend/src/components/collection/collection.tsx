"use client";

import { useCopy } from "@/i18n/useCopy";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  { image: "floresmagicascolecao.webp", name: "Flores Mágicas" },
  { image: "raizcolecao.webp", name: "Raiz" },
  { image: "crescimentocolecaoa.webp", name: "Crescimento A" },
  { image: "crescimentobcolecao.webp", name: "Crescimento B" },
  { image: "floracaocolecaoa.webp", name: "Floração A" },
  { image: "floracaocolecaob.webp", name: "Floração B" },
  { image: "finalizadorcolecao.webp", name: "Finalizador" },
] as const;

export default function Collection({ embedded = false }: { embedded?: boolean }) {
  const t = useCopy("Collection");
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

  const arrow = "absolute top-1/2 z-[2] size-[clamp(38px,4vw,50px)] -translate-y-1/2 rounded-full border border-white/80 bg-white/[.94] text-brand-plum shadow-[0_6px_24px_rgba(20,8,35,.25)] hover:bg-brand-leaf hover:text-[#210a41] focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-brand-leaf";
  const dot = "h-7 w-[23px] gap-0 rounded-none p-0 text-inherit hover:bg-white/10 focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-brand-leaf";

  return (
    <div id={embedded ? "colecao" : undefined} className={cn("min-h-screen bg-[radial-gradient(circle_at_84%_5%,rgba(137,84,202,.34),transparent_34%),linear-gradient(145deg,#2b1346_0%,#180d29_75%)] pt-[clamp(44px,6vw,84px)] pb-[clamp(70px,8vw,110px)] text-[#f8f4ff]", embedded && "min-h-0")}>
      <div className="mx-auto w-[min(1180px,calc(100%_-_48px))] max-[600px]:w-[calc(100%_-_28px)]">
        <div className="mb-[clamp(28px,4vw,48px)] max-w-[720px]">
          <span className="mb-[14px] inline-block text-[12px] font-black tracking-[.17em] text-brand-leaf">{t.eyebrow}</span>
          {embedded ? <h2 className="mt-0 mb-[15px] text-[clamp(36px,5vw,64px)] font-black leading-[1.08] tracking-[-.045em]">{t.heading}</h2> : <h1 className="mt-0 mb-[15px] text-[clamp(36px,5vw,64px)] font-black leading-[1.08] tracking-[-.045em]">{t.heading}</h1>}
          <p className="m-0 max-w-[590px] text-[clamp(15px,1.5vw,18px)] leading-[1.65] text-[#d8cce5]">{t.intro}</p>
        </div>

        <section
          className="overflow-hidden rounded-[clamp(16px,2.5vw,28px)] border border-white/[.16] bg-[#251936] shadow-[0_28px_70px_rgba(8,3,17,.35)]"
          aria-label={t.carousel}
          aria-roledescription="carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
          }}
        >
          <div className="relative aspect-[3/2] overflow-hidden bg-[#251936]">
            {slides.map((slide, index) => (
              <Image
                key={slide.image}
                src={`/images/collecao/${slide.image}`}
                alt={t.imageAlt.replace("{name}", slide.name)}
                fill
                sizes="(max-width: 760px) 100vw, 1180px"
                priority={index === 0}
                loading="eager"
                className={cn("pointer-events-none object-contain opacity-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none", index === active && "opacity-100")}
                aria-hidden={index !== active}
              />
            ))}
            <Button
              type="button"
              variant="secondary"
              size="icon-lg"
              className={`${arrow} left-[clamp(12px,2vw,26px)]`}
              aria-label={t.previous}
              onClick={() => setActive((current) => (current - 1 + slides.length) % slides.length)}
            >
              <ArrowLeft aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon-lg"
              className={`${arrow} right-[clamp(12px,2vw,26px)]`}
              aria-label={t.next}
              onClick={() => setActive((current) => (current + 1) % slides.length)}
            >
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>

          <div className="flex min-h-[94px] items-center justify-between gap-5 px-[clamp(20px,3vw,34px)] py-[19px] max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-[10px] max-[600px]:px-[18px] max-[600px]:pt-4 max-[600px]:pb-[18px]">
            <div className="flex items-baseline gap-[18px] max-[600px]:gap-3">
              <span className="whitespace-nowrap text-[12px] font-extrabold text-brand-leaf">{String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
              <h2 className="m-0 text-[clamp(20px,2.2vw,28px)] font-extrabold tracking-[-.025em]">{slides[active].name}</h2>
            </div>
            <div className="flex items-center gap-[2px] max-[600px]:self-center" aria-label={t.carousel}>
              {slides.map((slide, index) => (
                <Button
                  key={slide.image}
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className={dot}
                  aria-label={t.goTo.replace("{name}", slide.name)}
                  aria-current={index === active ? "true" : undefined}
                  onClick={() => setActive(index)}
                >
                  <span className={cn("h-[7px] w-[7px] rounded-full bg-[#8c7c9d] transition-[width,background] duration-[250ms] ease-in motion-reduce:transition-none", index === active && "w-4 rounded-[9px] bg-brand-leaf")} />
                </Button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
