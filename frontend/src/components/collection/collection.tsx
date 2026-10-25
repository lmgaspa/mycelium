"use client";

import { useCopy } from "@/i18n/useCopy";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { Link } from "@/lib/router";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import PageBanner from "@/components/common/PageBanner";
import StorePageSection from "@/components/common/StorePageSection";
import { storeOutlineButton } from "@/components/common/storePageStyles";
import { cn } from "@/lib/utils";

const order = ["flores-magicas", "raiz", "crescimento-parte-a", "crescimento-parte-b", "floracao-parte-a", "floracao-parte-b", "finalizador"] as const;
const slides = order.map((slug) => {
  const product = products.find((item) => item.slug === slug);
  if (!product?.catalogImage) throw new Error(`Missing collection image for ${slug}`);
  return { slug, catalogImage: product.catalogImage, phase: product.phase };
});

export default function Collection({ embedded = false }: { embedded?: boolean }) {
  const t = useCopy("Collection");
  const names = useCopy("ProductNames");
  const [active, setActive] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [textSlide, setTextSlide] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [cycle, setCycle] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const activeRef = useRef(0);
  const exitTimer = useRef<number | null>(null);
  const textTimer = useRef<number | null>(null);
  const slide = slides[active];
  const copySlide = slides[textSlide];
  const selectSlide = useCallback((next: number, manual = false) => {
    if (manual) setCycle((current) => current + 1);
    const current = activeRef.current;
    if (current === next) return;
    if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    setOutgoing(current);
    activeRef.current = next;
    setActive(next);
    if (textTimer.current !== null) window.clearTimeout(textTimer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTextSlide(next);
      setTextVisible(true);
    } else {
      setTextVisible(false);
      textTimer.current = window.setTimeout(() => {
        setTextSlide(next);
        setTextVisible(true);
      }, 150);
    }
    exitTimer.current = window.setTimeout(() => setOutgoing(null), 320);
  }, []);
  const go = (offset: number) => selectSlide((activeRef.current + offset + slides.length) % slides.length, true);

  useEffect(() => () => {
    if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    if (textTimer.current !== null) window.clearTimeout(textTimer.current);
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => { if (preference.matches) setPlaying(false); };
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) selectSlide((activeRef.current + 1) % slides.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [playing, cycle, selectSlide]);

  const arrow = "size-11 rounded-full border border-white/80 bg-white/[.94] text-brand-plum shadow-[0_6px_24px_rgba(20,8,35,.25)] hover:bg-brand-leaf hover:text-[#210a41] focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-brand-leaf";
  const dot = "h-7 w-[23px] gap-0 rounded-none p-0 text-inherit hover:bg-white/10 focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-brand-leaf";

  return (
    <>
      {!embedded && <PageBanner eyebrow={t.eyebrow} title={t.heading} description={t.intro} tone="plum" />}
      <StorePageSection id={embedded ? "colecao" : undefined} className="bg-[radial-gradient(circle_at_84%_5%,rgba(137,84,202,.34),transparent_34%),linear-gradient(145deg,#2b1346_0%,#180d29_75%)] text-[#f8f4ff]">
        {embedded && <div className="mb-[clamp(28px,4vw,48px)] max-w-[720px]">
          <span className="mb-[14px] inline-block text-[12px] font-black tracking-[.17em] text-brand-leaf">{t.eyebrow}</span>
          <h2 className="mt-0 mb-[15px] text-[clamp(36px,5vw,64px)] font-black leading-[1.08] tracking-[-.045em]">{t.heading}</h2>
          <p className="m-0 max-w-[590px] text-[clamp(15px,1.5vw,18px)] leading-[1.65] text-[#d8cce5]">{t.intro}</p>
        </div>}

        <section
          className="overflow-hidden rounded-[clamp(16px,2.5vw,28px)] border border-white/[.16] bg-[#251936] shadow-[0_28px_70px_rgba(8,3,17,.35)]"
          aria-label={t.carousel}
          aria-roledescription="carousel"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              go(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}
          onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
          onTouchEnd={(event) => {
            if (!touchStart.current) return;
            const dx = event.changedTouches[0].clientX - touchStart.current.x;
            const dy = event.changedTouches[0].clientY - touchStart.current.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
            touchStart.current = null;
          }}
        >
          <div className="relative grid min-h-[clamp(460px,40vw,500px)] grid-cols-[40%_60%] overflow-hidden bg-[#251936] min-[1440px]:min-h-[515px] min-[901px]:max-[1100px]:min-h-[clamp(312px,33vw,330px)] min-[901px]:max-[1100px]:grid-cols-[47%_53%] max-[900.99px]:min-h-0 max-[900.99px]:grid-cols-1">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1c0b29] via-[#251332] to-[#382245]" aria-hidden="true" />
            <div className="relative z-[1] flex min-w-0 flex-col items-start justify-center px-[clamp(30px,5vw,78px)] py-14 max-[1100px]:px-7 min-[901px]:max-[1100px]:py-4 max-[900.99px]:min-h-0 max-[900.99px]:justify-start max-[900.99px]:px-6 max-[900.99px]:py-4">
              <span className="mb-1 text-[11px] font-black tracking-[.2em] text-brand-leaf">{t.lineLabel}</span>
              <span className="mb-6 h-[2px] w-14 rounded-full bg-brand-leaf max-[900.99px]:mb-2" aria-hidden="true" />
              <div className="relative mb-5 w-full max-w-[420px] text-[clamp(42px,3.8vw,58px)] font-black leading-[.98] tracking-[-.055em] [overflow-wrap:anywhere] max-[600px]:text-[clamp(34px,9vw,42px)] max-[900.99px]:mb-2">
                <h3 className={cn("m-0 transition-opacity duration-150 ease-in-out motion-reduce:transition-none", !textVisible && "opacity-0")}>{names[copySlide.slug]}</h3>
              </div>
              <div className="relative mb-4 w-full max-w-[320px] text-[clamp(16px,1.7vw,20px)] leading-[1.5] text-[#eee4f4]">
                <p className={cn("m-0 transition-opacity duration-150 ease-in-out motion-reduce:transition-none", !textVisible && "opacity-0")}>{t.phaseDescription.replace("{phase}", t.phases[copySlide.phase])}</p>
              </div>
              <Button asChild variant="outline" className={storeOutlineButton}><Link to={`/products/${copySlide.slug}`}>{t.explore} <ArrowRight className="size-4" aria-hidden="true" /></Link></Button>
            </div>
            <div className="relative z-[1] flex min-h-[420px] min-w-0 items-center min-[901px]:max-[1100px]:min-h-[clamp(312px,33vw,330px)] min-[901px]:max-[1100px]:py-6 max-[900.99px]:min-h-0 max-[900.99px]:pb-4">
              <div className="relative mr-auto aspect-[3/2] w-[calc(100%_-_24px)] overflow-hidden rounded-[24px] [mask-image:radial-gradient(ellipse_95%_70%_at_58%_50%,black_42%,transparent_100%)] min-[1440px]:w-[calc(100%_-_32px)] max-[1100px]:rounded-[18px] max-[900.99px]:mx-auto max-[900.99px]:w-[calc(100%_-_48px)]">
                {outgoing !== null && <Image src={slides[outgoing].catalogImage} alt="" aria-hidden="true" fill sizes="(max-width: 1100px) 100vw, (max-width: 1180px) 58vw, 684px" className="pointer-events-none animate-out fade-out object-contain duration-300 motion-reduce:hidden" />}
                <Image key={slide.slug} src={slide.catalogImage} alt={t.imageAlt.replace("{name}", names[slide.slug])} fill sizes="(max-width: 1100px) 100vw, (max-width: 1180px) 58vw, 684px" priority={active === 0} className="animate-in fade-in object-contain duration-300 motion-reduce:animate-none" />
              </div>
            </div>
          </div>

          <div className="grid min-h-[94px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-5 px-[clamp(20px,3vw,34px)] py-[19px] max-[600px]:grid-cols-1 max-[600px]:justify-items-center max-[600px]:gap-2 max-[600px]:px-[18px] max-[600px]:pt-4 max-[600px]:pb-[18px]">
            <div className="flex min-w-0 items-baseline gap-[18px] max-[600px]:w-full max-[600px]:gap-3">
              <span className="whitespace-nowrap text-[12px] font-extrabold text-brand-leaf">{String(textSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
              <div className="relative min-w-0 flex-1 text-[clamp(20px,2.2vw,28px)] font-extrabold tracking-[-.025em]">
                <h2 className={cn("m-0 truncate transition-opacity duration-150 ease-in-out motion-reduce:transition-none", !textVisible && "opacity-0")}>{names[copySlide.slug]}</h2>
              </div>
            </div>
            <div className="flex items-center gap-[2px] max-[600px]:justify-center" aria-label={t.carousel}>
              {slides.map((slide, index) => (
                <Button
                  key={slide.slug}
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className={dot}
                  aria-label={t.goTo.replace("{name}", names[slide.slug])}
                  aria-current={index === active ? "true" : undefined}
                  onClick={() => selectSlide(index, true)}
                >
                  <span className={cn("h-[7px] w-[7px] rounded-full bg-[#8c7c9d] transition-[width,background] duration-[250ms] ease-in motion-reduce:transition-none", index === active && "w-4 rounded-[9px] bg-brand-leaf")} />
                </Button>
              ))}
            </div>
            <div className="flex items-center justify-self-end gap-2 max-[600px]:justify-self-center">
              <Button type="button" variant="ghost" size="icon-lg" className="size-11 rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white focus-visible:outline-[3px] focus-visible:outline-brand-leaf" aria-label={playing ? t.pause : t.play} aria-pressed={!playing} onClick={() => setPlaying((current) => !current)}>{playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}</Button>
              <Button type="button" variant="secondary" size="icon-lg" className={arrow} aria-label={t.previous} onClick={() => go(-1)}><ArrowLeft aria-hidden="true" /></Button>
              <Button type="button" variant="secondary" size="icon-lg" className={arrow} aria-label={t.next} onClick={() => go(1)}><ArrowRight aria-hidden="true" /></Button>
            </div>
          </div>
        </section>
      </StorePageSection>
    </>
  );
}
