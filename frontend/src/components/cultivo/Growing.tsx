"use client";

import { useCopy } from "@/i18n/useCopy";
import { ArrowRight, FlaskConical, Leaf, Sprout } from "lucide-react";
import { Link } from "@/lib/router";
import PageBanner from "@/components/common/PageBanner";
import StorePageSection from "@/components/common/StorePageSection";
import { storePrimaryButton } from "@/components/common/storePageStyles";
import { Button } from "@/components/ui/button";

const icons = [Sprout, Leaf, FlaskConical];

export default function Growing({ asPage = false }: { asPage?: boolean }) {
  const t = useCopy("Cultivo");
  const titleClass = "mt-0 mb-[14px] text-[clamp(32px,3.2vw,47px)] font-black leading-[1.14] tracking-[-.035em]";
  return (
    <>
    {asPage && <PageBanner eyebrow={t.label} title={t.title} description={t.body} titleId="guide-title" />}
    <StorePageSection id="cultivo" className="bg-white text-brand-ink" contentClassName={`grid grid-cols-[.95fr_1.05fr] ${asPage ? "items-start" : "items-center"} gap-[clamp(35px,7vw,100px)] max-[800px]:grid-cols-1`} aria-labelledby="guide-title">
        <div className="relative flex min-h-[470px] items-center justify-center bg-[radial-gradient(circle,#e9f4dc_0,transparent_67%)] max-[520px]:-my-[25px] max-[520px]:min-h-[410px] max-[520px]:scale-[.85]" aria-hidden="true">
          <div className="absolute flex h-[390px] w-[300px] translate-x-[62px] -translate-y-6 rotate-12 items-center justify-center rounded-[18px] bg-[#c9e5be] text-[120px] text-[#83ad6d] shadow-[0_20px_40px_rgba(38,22,58,.14)]"><Leaf className="size-[120px] stroke-[1.1]" /></div>
          <div className="absolute flex h-[390px] w-[300px] -translate-x-8 translate-y-[15px] -rotate-[7deg] flex-col items-start justify-between rounded-[18px] bg-[linear-gradient(145deg,#452173,#281148)] p-[30px] text-white shadow-[0_20px_40px_rgba(38,22,58,.14)]">
            <span className="text-[11px] font-extrabold tracking-[.16em]">MYCELIUM / CULTIVO</span><Sprout className="size-[100px] self-center stroke-[1.3] text-[#d0f0a1]" />
            <strong className="text-[30px] leading-[1.15]">{t.card}</strong>
            <div className="grid w-full gap-[6px] [&>i:last-child]:w-[60%]"><i className="h-[5px] rounded-[9px] bg-white/[.22]" /><i className="h-[5px] rounded-[9px] bg-white/[.22]" /><i className="h-[5px] rounded-[9px] bg-white/[.22]" /></div>
          </div>
        </div>
        <div className="max-[800px]:order-first">
          {!asPage && <><span className="mb-3 inline-block text-[12px] font-black leading-[1.4] tracking-[.18em] text-[#7543bc]">{t.label}</span><h2 id="guide-title" className={titleClass}>{t.title}</h2><p className="mt-0 mb-6 text-[16px] leading-[1.75] text-brand-muted">{t.body}</p></>}
          <div className="mb-[29px] grid gap-[15px]">
            {t.benefits.map((benefit, index) => {
              const Icon = icons[index];
              return (
                <div className="flex items-start gap-[15px]" key={benefit.title}>
                  <span className="flex size-[39px] flex-[0_0_39px] items-center justify-center rounded-[11px] bg-[#ede5f8] text-brand-plum"><Icon aria-hidden="true" /></span>
                  <div><strong className="text-[15px]">{benefit.title}</strong><p className="mt-[2px] mb-0 text-[13px] text-brand-muted">{benefit.body}</p></div>
                </div>
              );
            })}
          </div>
          <Button asChild className={storePrimaryButton}><Link to="/support">{t.action} <ArrowRight aria-hidden="true" /></Link></Button>
        </div>
    </StorePageSection>
    </>
  );
}
