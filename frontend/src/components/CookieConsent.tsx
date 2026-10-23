"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { apiGet, apiPost } from "../api/http";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Cookie } from "lucide-react";
import { useCopy } from "@/i18n/useCopy";

type ConsentView = {
  analytics: boolean;
  marketing: boolean;
  version: number;
  ts: number;
};

export default function CookieConsent() {
  const t = useCopy("CookieConsent");
  const [visible, setVisible] = useState(false);

  const notifyGate = (value: "true" | "false") => {
    try {
      localStorage.setItem(
        "analyticsConsent",
        value === "true" ? "true" : "false"
      );
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "CookieConsent: não foi possível usar localStorage.",
          err
        );
      }
    }
    window.dispatchEvent(new Event("cookie-consent-changed"));
  };

  const setCookie = (value: "true" | "false") => {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    const extra = isLocalhost ? "SameSite=Lax;" : "Secure; SameSite=None;";
    document.cookie = `cookie_consent=${value}; max-age=31536000; path=/; ${extra}`;
    try {
      localStorage.setItem("cookieConsentChoice", value);
    } catch {
      // O cookie continua sendo usado quando o armazenamento local está indisponível.
    }
  };

  useEffect(() => {
    const checkConsent = async () => {
      const cookieChoice = document.cookie.split(";").map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith("cookie_consent="))?.split("=")[1];
      let savedChoice = cookieChoice;
      if (savedChoice !== "true" && savedChoice !== "false") {
        try {
          savedChoice = localStorage.getItem("cookieConsentChoice") ?? undefined;
        } catch {
          // Continua com a consulta à API quando o armazenamento local está indisponível.
        }
      }
      if (savedChoice === "true" || savedChoice === "false") {
        notifyGate(savedChoice);
        setVisible(false);
        return;
      }

      try {
        const response = await apiGet<ConsentView>("/privacy/consent");
        if (response) {
          const accepted = response.analytics || response.marketing;
          setCookie(accepted ? "true" : "false");
          notifyGate(accepted ? "true" : "false");
          setVisible(false);
          return;
        }
      } catch {
        // Se API falhar, cai pro cookie local
      }
      setVisible(true);
    };
    checkConsent();
  }, []);

  const acceptCookies = async () => {
    setCookie("true");
    notifyGate("true");
    setVisible(false);
    try {
      await apiPost("/privacy/consent", { analytics: true, marketing: true, version: 1 });
    } catch { /* Silencioso */ }
  };

  const declineCookies = async () => {
    setCookie("false");
    notifyGate("false");
    setVisible(false);
    try {
      await apiPost("/privacy/consent", { analytics: false, marketing: false, version: 1 });
    } catch { /* Silencioso */ }
  };

  if (!visible) return null;

  return createPortal(
    <div
      className="fixed bottom-3 left-0 right-0 z-[9999] flex justify-center px-4 pointer-events-none"
      aria-live="polite"
    >
      <Card className="pointer-events-auto w-full max-w-3xl gap-0 overflow-hidden rounded-2xl border border-[#d6c6e8] bg-[#e9def5]! bg-[linear-gradient(110deg,#f5f0fa_0%,#e9def5_52%,#dccbf0_100%)] py-0 text-brand-ink shadow-[0_16px_40px_rgba(33,10,65,.18)]">
        <CardContent className="px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
            <Cookie className="shrink-0 text-[#4f8554]" size={22} aria-hidden />

            <p className="min-w-0 flex-1 text-sm text-brand-ink/80">
              <span className="font-semibold text-brand-plum">{t.title} </span>
              {t.body}
            </p>

            <div className="flex shrink-0 items-center gap-2 max-sm:ml-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer border-brand-plum/30 bg-white/50 text-brand-plum hover:bg-white hover:text-brand-plum"
                onClick={declineCookies}
              >
                {t.decline}
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                className="cursor-pointer bg-brand-plum font-semibold text-white hover:bg-brand-purple"
                onClick={acceptCookies}
              >
                {t.accept}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>,
    document.body
  );
}
