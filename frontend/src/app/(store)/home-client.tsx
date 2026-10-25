"use client";

import { useCopy } from "@/i18n/useCopy";
import { Link } from "@/lib/router";
import { ArrowRight, Droplets, Leaf, Sprout } from "lucide-react";
import Collection from "@/components/collection/collection";
import Cultivo from "@/components/cultivo/Cultivo";
import { storePageShell } from "@/components/common/storePageStyles";

function HomePage() {
  const t = useCopy("Home");
  const shell = storePageShell;
  const button = "inline-flex min-h-[46px] items-center justify-center gap-3 rounded-[24px] px-[23px] py-0 text-[13px] font-black uppercase tracking-[.035em] no-underline transition-[transform,box-shadow,background] hover:-translate-y-0.5 hover:shadow-[0_9px_22px_rgba(20,8,35,.18)]";
  const buttonLight = `${button} bg-white text-brand-plum hover:bg-[#e9f6d3]`;
  const buttonOutline = `${button} border border-white text-white hover:bg-white hover:text-brand-plum`;
  const kicker = "inline-block text-[12px] font-black leading-[1.4] tracking-[.18em]";
  const sectionHeading = "mt-0 mb-[14px] text-[clamp(32px,3.2vw,47px)] font-black leading-[1.14] tracking-[-.035em]";
  const benefit = "flex items-center gap-[14px] text-[15px] font-extrabold uppercase tracking-[.045em] max-[800px]:text-[11px] max-[520px]:w-full";
  const benefitIcon = "size-[27px] shrink-0 stroke-[1.8] text-brand-leaf";

  return (
    <div className="overflow-hidden text-brand-ink">
      <section className="relative isolate min-h-[570px] bg-[radial-gradient(circle_at_83%_34%,#a369ec_0,#6739ba_30%,transparent_57%),radial-gradient(circle_at_8%_90%,#437348_0,#32595b_25%,transparent_51%),linear-gradient(120deg,#182f30_0%,#263d5a_41%,#552595_100%)] text-white before:absolute before:inset-0 before:z-[-1] before:bg-[linear-gradient(90deg,rgba(15,24,30,.6),transparent_72%)]" aria-labelledby="hero-title">
        <div className="absolute -right-[140px] top-5 z-[-1] size-[500px] rounded-full bg-[#b464e7] opacity-35 blur-[105px]" aria-hidden="true" />
        <div className={`${shell} grid min-h-[570px] grid-cols-[1.05fr_.95fr] items-center gap-[35px] max-[800px]:grid-cols-1 max-[800px]:gap-0`}>
          <div className="relative z-[1] py-[54px] max-[800px]:pt-[60px] max-[800px]:pb-[10px]">
            <span className={`${kicker} mb-[22px] text-[#d7f2b0]`}>{t.eyebrow}</span>
            <h1 id="hero-title" className="mt-0 mb-7 max-w-[700px] text-[clamp(42px,4.65vw,70px)] font-black leading-[1.04] tracking-[-.04em] max-[520px]:text-[clamp(37px,10vw,48px)]">{t.hero}</h1>
            <p className="mt-0 mb-8 max-w-[540px] text-[17px] leading-[1.7] text-[#f0e9f9] max-[520px]:text-[15px]">{t.intro}</p>
            <div className="flex flex-wrap items-center gap-6">
              <Link className={buttonLight} to="/products/flores-magicas">{t.discover} <ArrowRight aria-hidden="true" /></Link>
              <Link className="text-[14px] font-extrabold text-white underline underline-offset-[5px]" to="/support">{t.contact}</Link>
            </div>
          </div>
          <div className="relative flex h-full min-h-[530px] items-center justify-center max-[800px]:min-h-[400px] max-[520px]:min-h-[350px]">
            <div className="absolute size-[420px] rotate-[-23deg] rounded-full border border-white/25 max-[520px]:size-[300px]" aria-hidden="true" />
            <div className="absolute h-[260px] w-[540px] rotate-[-23deg] rounded-full border border-white/25 max-[520px]:h-[180px] max-[520px]:w-[360px]" aria-hidden="true" />
            <img src="/images/floresmagicas.webp" alt={t.heroImageAlt} className="relative z-[2] h-auto w-[min(540px,100%)] rounded-[24px] object-contain [filter:drop-shadow(0_30px_32px_rgba(20,9,36,.28))] max-[800px]:w-[min(100%,520px)] max-[520px]:w-full" />
          </div>
        </div>
      </section>

      <div className="bg-brand-plum text-white" aria-label={t.highlightsAria}>
        <div className={`${shell} flex min-h-[93px] items-center justify-between gap-5 max-[800px]:flex-wrap max-[800px]:justify-center max-[800px]:py-5 max-[520px]:justify-start`}>
          <span className={benefit}><Leaf aria-hidden="true" className={benefitIcon} /> {t.strip1}</span>
          <span className={benefit}><Droplets aria-hidden="true" className={benefitIcon} /> 0-15-15</span>
          <span className={benefit}><Sprout aria-hidden="true" className={benefitIcon} /> {t.strip3}</span>
        </div>
      </div>

      <Collection embedded />

      <section id="produto" className="bg-[#fbfaf8] py-[90px] max-[520px]:py-[65px]" aria-labelledby="product-title">
        <div className={shell}>
          <div className="mx-auto mb-[38px] max-w-[720px] text-center">
            <span className={`${kicker} mb-3 text-[#7543bc]`}>{t.productLabel}</span>
            <h2 id="product-title" className={sectionHeading}>{t.productTitle}</h2>
            <p className="text-[16px] text-brand-muted">{t.productIntro}</p>
          </div>
          <div className="grid min-h-[465px] grid-cols-2 overflow-hidden rounded-[22px] shadow-[0_20px_50px_rgba(43,15,72,.1)] max-[800px]:grid-cols-1">
            <div className="relative flex min-h-[465px] items-center justify-center bg-[#6b2528] after:absolute after:bottom-[34px] after:h-[12%] after:w-[60%] after:rounded-full after:bg-[rgba(27,66,36,.12)] after:blur-[18px] max-[520px]:min-h-[360px]">
              <span className="absolute top-[25px] left-[25px] z-[2] rounded-[50px] bg-white px-[14px] py-[9px] text-[11px] font-black tracking-[.08em] text-[#355c38]">{t.biomineralBadge}</span>
              <img src="/images/floresmagicas.webp" alt={t.productImageAlt} loading="lazy" className="absolute inset-0 z-[1] h-full min-h-[465px] w-full object-cover max-[520px]:min-h-[360px]" />
            </div>
            <div className="flex flex-col items-start justify-center bg-brand-plum p-[clamp(32px,5vw,70px)] text-white max-[520px]:px-[25px] max-[520px]:py-[36px]">
              <span className={`${kicker} text-[#d5f5a7]`}>MYCELIUM · FLORES MÁGICAS</span>
              <h3 className="mt-1 mb-[18px] text-[clamp(58px,6vw,88px)] font-black leading-none tracking-[-.06em]">Flores Mágicas</h3>
              <p className="max-w-[430px] text-[17px] leading-[1.6] text-[#eee8f4]">{t.productBody}</p>
              <ul className="my-[22px] mb-7 grid list-disc gap-2 pl-[21px] text-[14px] text-[#f3eefa] marker:text-brand-leaf"><li>{t.productBullet1}</li><li>{t.productBullet2}</li><li>{t.productBullet3}</li></ul>
              <Link className={buttonOutline} to="/products/flores-magicas">{t.more} <ArrowRight aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </section>

      <Cultivo />

      <section className="bg-white px-0 pt-0 pb-[75px]" aria-labelledby="contact-title">
        <div className={`${shell} flex min-h-[210px] items-center justify-between gap-8 rounded-[20px] bg-[linear-gradient(115deg,#7640d5,#9354ed)] px-[44px] py-[35px] text-white shadow-[0_12px_28px_rgba(60,24,118,.17)] max-[520px]:flex-col max-[520px]:items-start max-[520px]:px-6 max-[520px]:py-[30px]`}>
          <div>
            <span className={`${kicker} text-[#d5f5a7]`}>{t.contactLabel}</span>
            <h2 id="contact-title" className="mt-0 mb-[7px] text-[clamp(26px,2.7vw,38px)] font-black leading-[1.2]">{t.contactTitle}</h2>
            <p className="m-0 max-w-[630px] leading-[1.55]">{t.contactBody}</p>
          </div>
          <Link className={`${buttonLight} shrink-0`} to="/support">{t.contactAction} <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
