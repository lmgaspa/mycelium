"use client";

import { useCopy } from "@/i18n/useCopy";
import PageBanner from "@/components/common/PageBanner";

function SupportPage() {
  const t = useCopy("Support");
  const shell = "mx-auto w-[min(1180px,calc(100%_-_48px))] max-[520px]:w-[min(100%_-_32px,1180px)]";
  const kicker = "mb-3 inline-block text-[12px] font-black leading-[1.4] tracking-[.18em]";
  return (
    <div>
      <PageBanner eyebrow={t.eyebrow} title={t.title} description={t.body} />
      <section className={`${shell} grid grid-cols-[1fr_320px] items-center gap-[50px] py-[75px] max-[800px]:grid-cols-1`}>
        <div>
          <span className={`${kicker} text-[#7543bc]`}>{t.while}</span>
          <h2 className="mt-0 mb-[10px] text-[38px] font-black">{t.product}</h2>
          <p className="mb-[25px] max-w-[520px] leading-[1.7] text-brand-muted">{t.productBody}</p>
          <a className="inline-flex min-h-[46px] items-center justify-center gap-3 rounded-[24px] bg-brand-plum px-[23px] py-0 text-[13px] font-black uppercase tracking-[.035em] text-white no-underline transition-[transform,box-shadow,background] hover:-translate-y-0.5 hover:bg-[#552b88] hover:shadow-[0_9px_22px_rgba(20,8,35,.18)]" href="/products/flores-magicas">{t.action}</a>
        </div>
        <img src="/images/floresmagicas.webp" alt={t.imageAlt} className="h-[320px] w-[250px] rounded-[18px] object-contain" />
      </section>
    </div>
  );
}

export default SupportPage;
