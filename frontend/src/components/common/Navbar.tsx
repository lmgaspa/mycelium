"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Check, Globe2, LogIn, LogOut, Menu, ShoppingBag, UserRound, UserRoundPlus, X } from "lucide-react";
import { CartContext } from "@/context/CartContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localeTags, readLocale, saveLocale, type Locale } from "@/app/auth/locale";

const copy = {
  pt: { home: "Início", products: "Produtos", grow: "Cultivo", contact: "Contato", login: "Entrar", register: "Registrar", account: "Minha conta", logout: "Sair", cart: "Carrinho", language: "Selecionar idioma", menu: "Abrir menu" },
  en: { home: "Home", products: "Products", grow: "Growing", contact: "Contact", login: "Sign in", register: "Register", account: "My account", logout: "Sign out", cart: "Cart", language: "Select language", menu: "Open menu" },
  es: { home: "Inicio", products: "Productos", grow: "Cultivo", contact: "Contacto", login: "Entrar", register: "Registrar", account: "Mi cuenta", logout: "Salir", cart: "Carrito", language: "Seleccionar idioma", menu: "Abrir menú" },
} as const;

const languages: { code: Locale; flag: string; label: string }[] = [
  { code: "pt", flag: "🇧🇷", label: "Português" },
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "es", flag: "🇪🇸", label: "Español" },
];

export default function Navbar({ variant = "store" }: { variant?: "store" | "auth" }) {
  const cart = useContext(CartContext);
  const [mounted, setMounted] = useState(false);
  const count = mounted ? (cart?.cartItems.reduce((sum, item) => sum + item.quantity, 0) ?? 0) : 0;
  const [locale, setLocale] = useState<Locale>("pt");
  const [signedIn, setSignedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = copy[locale];

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
    if (variant === "auth") window.location.assign("/");
  };

  const languageMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="myc-icon-button myc-language-trigger" type="button" aria-label={t.language} title={t.language}>
          <Globe2 aria-hidden="true" /><span className="myc-language-code">{locale.toUpperCase()}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="myc-language-menu">
        {languages.map(({ code, flag, label }) => (
          <DropdownMenuItem key={code} onSelect={() => selectLocale(code)} className="myc-language-option">
            <span aria-hidden="true" className="myc-language-flag">{flag}</span>
            <span lang={localeTags[code]}>{label}</span>
            {locale === code ? <Check aria-hidden="true" className="myc-language-check" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const accountLinks = (
    <>
      {signedIn ? (
        <>
          <Link className="myc-header-link" href="/settings"><UserRound aria-hidden="true" />{t.account}</Link>
          <button className="myc-header-cta myc-header-cta-outline" type="button" onClick={logout}><LogOut aria-hidden="true" />{t.logout}</button>
        </>
      ) : (
        <>
          <Link className="myc-header-link" href="/login"><LogIn aria-hidden="true" />{t.login}</Link>
          <Link className="myc-header-cta" href="/register"><UserRoundPlus aria-hidden="true" />{t.register}</Link>
        </>
      )}
    </>
  );

  return (
    <header className={`myc-header ${variant === "auth" ? "myc-header-auth" : ""}`}>
      <div className="myc-shell myc-header-inner">
        <Link href="/" className="myc-brand" aria-label="Mycelium — início"><img src="/images/logomycelium.webp" alt="Mycelium" /></Link>
        {variant === "store" ? (
          <nav className="myc-nav" aria-label="Navegação principal">
            <Link href="/">{t.home}</Link><Link href="/#produto">{t.products}</Link><Link href="/#cultivo">{t.grow}</Link><Link href="/support">{t.contact}</Link>
          </nav>
        ) : <div className="myc-header-spacer" />}
        <div className="myc-header-tools">
          {languageMenu}
          <Link href="/cart" className="myc-icon-button myc-cart-link" aria-label={`${t.cart}${count ? ` (${count})` : ""}`} title={t.cart}>
            <ShoppingBag aria-hidden="true" />{count > 0 ? <span className="myc-cart-count">{count > 99 ? "99+" : count}</span> : null}
          </Link>
          <div className="myc-account-actions">{accountLinks}</div>
          <button className="myc-icon-button myc-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="myc-mobile-menu" aria-label={menuOpen ? "Fechar menu" : t.menu} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      <div id="myc-mobile-menu" className={`myc-mobile-menu ${menuOpen ? "is-open" : ""}`} hidden={!menuOpen}>
        {variant === "store" ? (
          <nav aria-label="Navegação móvel" className="myc-mobile-nav">
            <Link href="/" onClick={() => setMenuOpen(false)}>{t.home}</Link>
            <Link href="/#produto" onClick={() => setMenuOpen(false)}>{t.products}</Link>
            <Link href="/#cultivo" onClick={() => setMenuOpen(false)}>{t.grow}</Link>
            <Link href="/support" onClick={() => setMenuOpen(false)}>{t.contact}</Link>
          </nav>
        ) : null}
        <div className="myc-mobile-account">{accountLinks}</div>
      </div>
    </header>
  );
}
