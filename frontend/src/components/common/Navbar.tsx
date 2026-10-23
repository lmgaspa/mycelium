"use client";

import { useCopy } from "@/i18n/useCopy";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Check, Globe2, LogIn, LogOut, Menu, ShoppingBag, UserRound, UserRoundPlus, X } from "lucide-react";
import { CartContext } from "@/context/CartContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localeTags, readLocale, saveLocale, type Locale } from "@/app/auth/locale";
import { cn } from "@/lib/utils";
import { brandGradient, brandNavLink } from "@/components/common/brandGradient";

const languages: { code: Locale; flag: string; label: string }[] = [
  { code: "pt", flag: "🇧🇷", label: "Português" },
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "es", flag: "🇪🇸", label: "Español" },
];

export default function Navbar() {
  const cart = useContext(CartContext);
  const [mounted, setMounted] = useState(false);
  const count = mounted ? (cart?.cartItems.reduce((sum, item) => sum + item.quantity, 0) ?? 0) : 0;
  const [locale, setLocale] = useState<Locale>("pt");
  const [signedIn, setSignedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useCopy("Navbar");

  useEffect(() => {
    setMounted(true);
    const current = readLocale();
    setLocale(current);
    document.documentElement.lang = localeTags[current];
    const onLocaleChange = (event: Event) => setLocale((event as CustomEvent<Locale>).detail);
    window.addEventListener("myc-locale-change", onLocaleChange);
    return () => window.removeEventListener("myc-locale-change", onLocaleChange);
  }, []);

  useEffect(() => {
    fetch("/api/v1/auth/me", { credentials: "same-origin" })
      .then((response) => setSignedIn(response.ok))
      .catch(() => setSignedIn(false));
  }, []);

  const selectLocale = (next: Locale) => {
    saveLocale(next);
    setLocale(next);
    if (signedIn) {
      void fetch("/api/v1/auth/locale", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
    }
  };

  const logout = async () => {
    await fetch("/api/v1/auth/logout", { method: "POST", credentials: "same-origin" });
    setSignedIn(false);
    setMenuOpen(false);
  };

  const iconButton = "relative inline-flex h-[38px] min-w-[38px] cursor-pointer items-center justify-center gap-[5px] rounded-[10px] border border-white/[.16] bg-white/[.08] px-[9px] py-0 text-white no-underline transition-[background,border-color] hover:border-white/[.38] hover:bg-white/[.17] focus-visible:border-white/[.38] focus-visible:bg-white/[.17] focus-visible:outline-none [&_svg]:size-[19px] [&_svg]:stroke-[1.8] max-[520px]:h-[34px] max-[520px]:min-w-[34px] max-[520px]:rounded-[8px] max-[520px]:px-[6px] max-[520px]:[&_svg]:size-[17px]";
  const navLink = `whitespace-nowrap ${brandNavLink}`;
  const headerLink = "inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-[7px] whitespace-nowrap rounded-[10px] border border-white/25 bg-white/[.03] px-[13px] text-[12px] font-extrabold text-white no-underline [&_svg]:size-[15px] [&_svg]:shrink-0 [&_svg]:stroke-2 hover:bg-white/[.13] max-[1180px]:min-h-[42px] max-[1180px]:w-full";
  const headerCta = "inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-[7px] whitespace-nowrap rounded-[10px] border border-transparent px-[13px] text-[12px] font-extrabold no-underline [&_svg]:size-[15px] [&_svg]:shrink-0 [&_svg]:stroke-2 max-[1180px]:min-h-[42px] max-[1180px]:w-full";
  const headerCtaSolid = `${headerCta} bg-white text-brand-plum hover:bg-[#e9f6d3]`;
  const headerCtaOutline = `${headerCta} border-white/25 bg-transparent text-white`;
  const cartLink = "relative inline-flex h-[38px] w-[38px] shrink-0 cursor-pointer items-center justify-center gap-[5px] rounded-[10px] border border-white/[.16] bg-white/[.08] p-0 text-white no-underline transition-[background,border-color] hover:border-white/[.38] hover:bg-white/[.17] focus-visible:border-white/[.38] focus-visible:bg-white/[.17] focus-visible:outline-none [&_svg]:size-[19px] [&_svg]:stroke-[1.8] max-[520px]:h-[34px] max-[520px]:w-[34px] max-[520px]:rounded-[8px] max-[520px]:[&_svg]:size-[17px]";

  const languageMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={iconButton} type="button" aria-label={t.language} title={t.language}>
          <Globe2 aria-hidden="true" /><span className="text-[11px] font-black tracking-[.04em] max-[520px]:hidden">{locale.toUpperCase()}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="z-[80] min-w-[176px] rounded-[13px] border border-[#4d4260] bg-[#211d2d] p-[6px] text-[#eeeaf5] shadow-[0_16px_36px_rgba(10,3,24,.28)]">
        {languages.map(({ code, flag, label }) => (
          <DropdownMenuItem key={code} onSelect={() => selectLocale(code)} className="flex min-h-[38px] cursor-pointer items-center gap-[10px] rounded-[8px] px-[10px] py-[6px] text-[13px] data-[highlighted]:bg-[#393048] data-[highlighted]:text-white">
            <span aria-hidden="true" className="text-[16px] leading-none">{flag}</span>
            <span lang={localeTags[code]}>{label}</span>
            {locale === code ? <Check aria-hidden="true" className="ml-auto size-[15px] text-brand-leaf" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const accountLinks = (
    <>
      {signedIn ? (
        <>
          <Link className={headerLink} href="/settings"><UserRound aria-hidden="true" />{t.account}</Link>
          <button className={headerCtaOutline} type="button" onClick={logout}><LogOut aria-hidden="true" />{t.logout}</button>
        </>
      ) : (
        <>
          <Link className={headerLink} href="/login"><LogIn aria-hidden="true" />{t.login}</Link>
          <Link className={headerCtaSolid} href="/register"><UserRoundPlus aria-hidden="true" />{t.register}</Link>
        </>
      )}
    </>
  );

  return (
    <header className={cn("relative z-30 border-b border-white/[.08] text-white", brandGradient)}>
      <div className="mx-auto flex min-h-[76px] w-[min(1180px,calc(100%_-_48px))] items-center gap-[clamp(18px,3vw,42px)] max-[1180px]:min-h-[70px] max-[520px]:w-[min(100%_-_32px,1180px)] max-[520px]:gap-2">
        <Link href="/" className="inline-flex flex-[0_0_auto] items-center" aria-label={t.homeAria}><img src="/images/logomycelium.webp" alt="My Celium" className="h-10 w-[154px] object-contain [filter:brightness(0)_saturate(100%)_invert(90%)_sepia(16%)_saturate(626%)_hue-rotate(35deg)] max-[800px]:h-[37px] max-[800px]:w-[145px] max-[520px]:h-[30px] max-[520px]:w-[clamp(96px,29vw,124px)]" /></Link>
        <nav className="flex flex-1 items-center justify-center gap-[clamp(15px,2.4vw,33px)] max-[1180px]:hidden" aria-label={t.mainNav}>
          <Link className={navLink} href="/">{t.home}</Link><Link className={navLink} href="/products">{t.products}</Link><Link className={navLink} href="/collection">{t.collection}</Link><Link className={navLink} href="/growing">{t.grow}</Link><Link className={navLink} href="/support">{t.contact}</Link>
        </nav>
        <div className="flex shrink-0 items-center gap-[9px] max-[1180px]:ml-auto max-[520px]:gap-[5px]">
          {languageMenu}
          <Link href="/cart" className={cartLink} aria-label={`${t.cart}${count ? ` (${count})` : ""}`} title={t.cart}>
            <ShoppingBag aria-hidden="true" />{count > 0 ? <span className="absolute -top-[7px] -right-[7px] grid h-[19px] min-w-[19px] place-items-center rounded-[10px] bg-brand-leaf px-[3px] text-[10px] font-black text-[#210f3b]">{count > 99 ? "99+" : count}</span> : null}
          </Link>
          <div className="ml-[5px] flex items-center gap-2 max-[1180px]:hidden">{accountLinks}</div>
          <button className={cn(iconButton, "hidden max-[1180px]:inline-flex")} type="button" aria-expanded={menuOpen} aria-controls="myc-mobile-menu" aria-label={menuOpen ? t.closeMenu : t.menu} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      <div id="myc-mobile-menu" className={cn("hidden", menuOpen && "max-[1180px]:absolute max-[1180px]:top-[calc(100%_-_1px)] max-[1180px]:right-3 max-[1180px]:block max-[1180px]:w-[min(430px,calc(100%_-_24px))] max-[1180px]:rounded-b-[18px] max-[1180px]:border max-[1180px]:border-white/15 max-[1180px]:p-4 max-[1180px]:shadow-[0_22px_42px_rgba(13,5,31,.32)]", menuOpen && brandGradient)} hidden={!menuOpen}>
        <nav aria-label={t.mobileNav} className="mb-[14px] grid grid-cols-1 gap-1 border-b border-white/[.13] pb-[14px]">
          <Link className="rounded-[8px] px-3 py-[9px] text-[13px] font-bold text-[#eee9f5] no-underline hover:bg-white/[.09] focus-visible:bg-white/[.09]" href="/" onClick={() => setMenuOpen(false)}>{t.home}</Link>
          <Link className="rounded-[8px] px-3 py-[9px] text-[13px] font-bold text-[#eee9f5] no-underline hover:bg-white/[.09] focus-visible:bg-white/[.09]" href="/products" onClick={() => setMenuOpen(false)}>{t.products}</Link>
          <Link className="rounded-[8px] px-3 py-[9px] text-[13px] font-bold text-[#eee9f5] no-underline hover:bg-white/[.09] focus-visible:bg-white/[.09]" href="/collection" onClick={() => setMenuOpen(false)}>{t.collection}</Link>
          <Link className="rounded-[8px] px-3 py-[9px] text-[13px] font-bold text-[#eee9f5] no-underline hover:bg-white/[.09] focus-visible:bg-white/[.09]" href="/growing" onClick={() => setMenuOpen(false)}>{t.grow}</Link>
          <Link className="rounded-[8px] px-3 py-[9px] text-[13px] font-bold text-[#eee9f5] no-underline hover:bg-white/[.09] focus-visible:bg-white/[.09]" href="/support" onClick={() => setMenuOpen(false)}>{t.contact}</Link>
        </nav>
        <div className="grid gap-2">{accountLinks}</div>
      </div>
    </header>
  );
}
