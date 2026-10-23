// src/components/CookieConsent.tsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { apiGet, apiPost } from "../api/http";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Cookie } from "lucide-react";

type ConsentView = {
  analytics: boolean;
  marketing: boolean;
  version: number;
  ts: number;
};

export default function CookieConsent() {
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
  };

  useEffect(() => {
    const checkConsent = async () => {
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
      const consent = document.cookie.includes("cookie_consent=true");
      if (!consent) setVisible(true);
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
      <Card className="w-full max-w-3xl pointer-events-auto shadow-xl border border-border bg-card gap-0">
        <CardContent className="py-2 px-4">
          <div className="flex items-center gap-3">
            <Cookie className="shrink-0 text-primary" size={20} aria-hidden />

            <p className="flex-1 min-w-0 text-sm text-muted-foreground">
              <span className="font-semibold text-card-foreground">Cookies: </span>
              Usamos cookies conforme a{" "}
              <span className="font-medium text-card-foreground">LGPD</span>.
              Você pode aceitar ou recusar.
            </p>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={declineCookies}
              >
                Recusar
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={acceptCookies}
              >
                Aceitar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>,
    document.body
  );
}
