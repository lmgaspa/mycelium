import { useCopy } from "@/i18n/useCopy";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";
import { brandGradient, brandNavLink } from "@/components/common/brandGradient";

function Footer() {
  const t = useCopy("Footer");
  const shell = "mx-auto w-[min(1180px,calc(100%_-_48px))] max-[520px]:w-[min(100%_-_32px,1180px)]";
  const link = brandNavLink;
  const heading = "mt-0 mb-2 text-[13px] font-extrabold uppercase tracking-[.045em] text-white";
  return (
    <footer className={cn("px-0 pt-[54px] pb-[22px] font-sans text-white", brandGradient)}>
      <div className={`${shell} grid grid-cols-[2fr_1fr_1fr_1.15fr] gap-[42px] max-[800px]:grid-cols-2 max-[520px]:gap-x-[18px] max-[520px]:gap-y-8 [&>div]:flex [&>div]:flex-col [&>div]:items-start [&>div]:gap-[11px]`}>
        <div className="max-[520px]:col-span-full"><Link to="/" aria-label={t.homeAria}><img src="/images/logomycelium.webp" alt="Mycelium" className="h-[50px] w-[195px] object-contain [filter:brightness(0)_saturate(100%)_invert(90%)_sepia(16%)_saturate(626%)_hue-rotate(35deg)]" /></Link><p className="m-0 max-w-[270px] text-[13px] leading-[1.6] text-[#f5efff]">{t.body}</p></div>
        <div><h2 className={heading}>{t.explore}</h2><Link className={link} to="/">{t.home}</Link><Link className={link} to="/products">{t.products}</Link><Link className={link} to="/growing">{t.grow}</Link></div>
        <div><h2 className={heading}>{t.service}</h2><Link className={link} to="/support">{t.contact}</Link></div>
        <div><h2 className={heading}>Mycelium</h2><p className="m-0 max-w-[270px] text-[13px] leading-[1.6] text-[#f5efff]">{t.motto}</p></div>
      </div>
      <div className={`${shell} mt-12 border-t border-white/[.14] pt-[18px] text-[12px] text-[#f5efff]`}><span>© {new Date().getFullYear()} Mycelium</span></div>
    </footer>
  );
}

export default Footer;
