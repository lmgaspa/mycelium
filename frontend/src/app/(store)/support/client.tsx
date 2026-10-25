"use client";

import { useCopy } from "@/i18n/useCopy";
import PageBanner from "@/components/common/PageBanner";
import { Button } from "@/components/ui/button";
import { storePrimaryButton } from "@/components/common/storePageStyles";
import StorePageSection from "@/components/common/StorePageSection";
import Link from "next/link";

function SupportPage() {
  const t = useCopy("Support");
  const kicker = "mb-3 inline-block text-[12px] font-black leading-[1.4] tracking-[.18em]";
  return (
    <div>
      <PageBanner eyebrow={t.eyebrow} title={t.title} description={t.body} />
      <StorePageSection contentClassName="grid grid-cols-[1fr_320px] items-start gap-[50px] max-[800px]:grid-cols-1 max-[800px]:gap-8">
        <div>
          <span className={`${kicker} text-[#7543bc]`}>{t.while}</span>
          <h2 className="mt-0 mb-[10px] text-[38px] font-black">{t.product}</h2>
          <p className="mb-[25px] max-w-[520px] leading-[1.7] text-brand-muted">{t.productBody}</p>
          <Button asChild className={storePrimaryButton}><Link href="/products/flores-magicas">{t.action}</Link></Button>
        </div>
        <img src="/images/floresmagicas.webp" alt={t.imageAlt} className="h-[320px] w-[250px] justify-self-center rounded-[18px] object-contain max-[800px]:justify-self-start" />
      </StorePageSection>
    </div>
  );
}

export default SupportPage;
