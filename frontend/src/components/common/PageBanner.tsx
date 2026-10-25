import { storePageBannerSpacing, storePageShell } from "@/components/common/storePageStyles";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PageBannerProps = {
  eyebrow: string;
  title: string;
  description: string;
  tone?: "brand" | "plum";
  titleId?: string;
  action?: ReactNode;
};

export default function PageBanner({ eyebrow, title, description, tone = "brand", titleId, action }: PageBannerProps) {
  return (
    <header className={cn(storePageBannerSpacing, "text-white", tone === "brand" ? "bg-[radial-gradient(circle_at_85%_20%,rgba(158,102,223,.5),transparent_34%),linear-gradient(120deg,#203c38,#361958_60%,#5b2f94)]" : "bg-[radial-gradient(circle_at_85%_20%,rgba(158,102,223,.38),transparent_34%),linear-gradient(120deg,#26133e,#351260_65%,#522b80)]")}>
      <div className={storePageShell}>
        <span className="mb-1.5 inline-block text-[11px] font-black uppercase tracking-[.17em] text-brand-leaf">{eyebrow}</span>
        <h1 id={titleId} className="mt-0 mb-2 max-w-[1000px] text-[clamp(34px,3.4vw,48px)] font-black leading-[1.08] tracking-[-.045em]">{title}</h1>
        <p className="m-0 max-w-[1080px] text-[clamp(15px,1.4vw,18px)] leading-[1.6] text-[#eee7f7]">{description}</p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </header>
  );
}
