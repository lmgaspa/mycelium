"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { ArrowRight, KeyRound, LogOut, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/common/Navbar";
import type { Locale } from "./locale";
import { localeTags, messages, readLocale, useLocale } from "./locale";
import "./auth.css";

export type AuthMode = "login" | "register" | "forgot" | "reset" | "verify" | "settings" | "changePassword" | "changeEmail" | "confirmEmailChange" | "checkEmail";

type Profile = { id: string; email: string; displayName: string; locale: Locale };

async function request(path: string, body: unknown, locale: Locale): Promise<Response> {
  return fetch(`/api/v1/auth/${path}`, {
    method: "POST", credentials: "same-origin",
    headers: { "Content-Type": "application/json", "Accept-Language": localeTags[locale] },
    body: JSON.stringify(body),
  });
}

const googleLocales: Record<Locale, string> = { pt: "pt_BR", en: "en", es: "es" };

function GoogleMark() {
  return (
    <svg aria-hidden="true" width="19" height="19" viewBox="0 0 48 48" className="auth-google-mark">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.887 32.658 29.35 36 24 36 16.82 36 11 30.18 11 23S16.82 10 24 10c3.181 0 6.073 1.205 8.291 3.176l5.657-5.657C34.902 4.012 29.712 2 24 2 12.954 2 3.999 10.955 3.999 22S12.954 42 24 42c11.046 0 20-8.955 20-20 0-1.341-.138-2.651-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.817C14.46 16.136 18.865 13 24 13c3.181 0 6.073 1.205 8.291 3.176l5.657-5.657C34.902 4.012 29.712 2 24 2 16.318 2 9.597 6.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 42c5.258 0 10.06-2.01 13.651-5.289l-6.305-5.33C29.35 36 24 36c-5.33 0-9.856-3.322-11.29-7.79l-6.54 5.04C9.402 37.663 16.118 42 24 42z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.083 3.314-3.87 5.89-7.657 6.888l6.305 5.33C37.024 37.668 40 31.667 40 24c0-1.341-.138-2.651-.389-3.917z" />
    </svg>
  );
}

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const locale = useLocale();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const googleSlotRef = useRef<HTMLDivElement>(null);
  const [googleWidth, setGoogleWidth] = useState(360);
  const t = messages[locale];

  useEffect(() => {
    if (mode !== "settings" && mode !== "changePassword" && mode !== "changeEmail") return;
    fetch("/api/v1/auth/me", { credentials: "same-origin" }).then(async (response) => {
      if (!response.ok) { window.location.assign("/login"); return; }
      setProfile(await response.json());
    }).catch(() => setError(messages[readLocale()].genericError));
  }, [mode]);

  const token = () => new URLSearchParams(window.location.search).get("token") || "";
  const finishLogin = () => {
    const next = new URLSearchParams(window.location.search).get("next");
    window.location.assign(next?.startsWith("/") && !next.startsWith("//") ? next : "/settings");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError(""); setFeedback("");
    try {
      let path = ""; let body: Record<string, string> = {};
      switch (mode) {
        case "login": path = "login"; body = { email, password }; break;
        case "register": path = "register"; body = { name, email, password, locale }; break;
        case "forgot": path = "forgot-password"; body = { email }; break;
        case "reset": path = "reset-password"; body = { token: token(), newPassword }; break;
        case "verify": path = "confirm-email"; body = { token: token() }; break;
        case "changePassword": path = "change-password"; body = { currentPassword: password, newPassword }; break;
        case "changeEmail": path = "change-email/request"; body = { newEmail }; break;
        case "confirmEmailChange": path = "change-email/confirm"; body = { token: token() }; break;
        case "checkEmail": path = "confirm/resend"; body = { email }; break;
        default: return;
      }
      const response = await request(path, body, locale);
      if (!response.ok) {
        setError(mode === "login" && response.status === 401 ? t.invalidLogin : t.genericError);
        return;
      }
      if (mode === "login") { finishLogin(); return; }
      if (mode === "register") { window.location.assign("/check-email"); return; }
      if (mode === "forgot" || mode === "changeEmail" || mode === "checkEmail") { setFeedback(mode === "forgot" ? t.resetSent : t.checkEmail); return; }
      setFeedback(mode === "verify" ? t.verified : t.changed);
    } catch { setError(t.genericError); }
    finally { setBusy(false); }
  };

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  useEffect(() => {
    if (!googleClientId || !googleSlotRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setGoogleWidth(Math.min(400, Math.max(200, Math.floor(entry.contentRect.width))));
    });
    observer.observe(googleSlotRef.current);
    return () => observer.disconnect();
  }, [googleClientId, mode]);
  const googleSignIn = async (credential: string) => {
    setBusy(true); setError("");
    try {
      const response = await request("google", { credential, locale }, locale);
      if (!response.ok) { setError(t.genericError); return; }
      finishLogin();
    } catch { setError(t.genericError); }
    finally { setBusy(false); }
  };

  const heading = mode === "checkEmail" ? t.checkEmail : t[mode];
  const story = {
    pt: { eyebrow: "CULTIVE COM A MYCELIUM", title: "Uma experiência que floresce com você.", body: "Entre na sua conta para acompanhar suas escolhas e cuidar dos seus dados com tranquilidade.", note: "Sua conta, suas escolhas, no seu idioma." },
    en: { eyebrow: "GROW WITH MYCELIUM", title: "An experience that grows with you.", body: "Sign in to follow your choices and manage your details with confidence.", note: "Your account, your choices, in your language." },
    es: { eyebrow: "CULTIVA CON MYCELIUM", title: "Una experiencia que florece contigo.", body: "Entra en tu cuenta para seguir tus elecciones y gestionar tus datos con tranquilidad.", note: "Tu cuenta, tus elecciones, en tu idioma." },
  }[locale];
  return (
    <div className="auth-page">
      <Navbar variant="auth" />
      <div className="auth-stage">
      <aside className="auth-story">
        <span className="auth-story-icon"><Sparkles aria-hidden="true" /></span>
        <p className="auth-story-eyebrow">{story.eyebrow}</p>
        <h2>{story.title}</h2>
        <p>{story.body}</p>
        <div className="auth-story-note"><ShieldCheck aria-hidden="true" />{story.note}</div>
      </aside>
      <main className="auth-panel">
        <span className="auth-eyebrow"><Sparkles aria-hidden="true" /> MYCELIUM / CONTA</span>
        <h1>{heading}</h1>
        {mode === "checkEmail" ? <p>{t.checkEmail}</p> : null}
        {mode === "settings" ? (
          <>
            <p>{t.accountIntro}</p>
            {profile ? <p className="auth-profile">{profile.displayName} · {profile.email}</p> : null}
            <div className="auth-settings-links"><a href="/settings/change-password"><KeyRound aria-hidden="true" />{t.changePassword}<ArrowRight aria-hidden="true" /></a><a href="/settings/change-email"><Mail aria-hidden="true" />{t.changeEmail}<ArrowRight aria-hidden="true" /></a></div>
            <Button type="button" variant="outline" className="auth-secondary" onClick={async () => { await request("logout", {}, locale); window.location.assign("/"); }}><LogOut aria-hidden="true" />{t.logout}</Button>
          </>
        ) : (
          <form onSubmit={submit}>
            {mode === "register" ? <label>{t.name}<Input autoComplete="name" required minLength={2} maxLength={120} value={name} onChange={e => setName(e.target.value)} /></label> : null}
            {mode === "login" || mode === "register" || mode === "forgot" || mode === "checkEmail" ? <label>{t.email}<Input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label> : null}
            {mode === "changeEmail" ? <label>{t.newEmail}<Input type="email" autoComplete="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)} /></label> : null}
            {mode === "login" || mode === "register" || mode === "changePassword" ? <label>{mode === "changePassword" ? t.currentPassword : t.password}<Input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={mode === "login" ? 1 : 12} value={password} onChange={e => setPassword(e.target.value)} /></label> : null}
            {mode === "reset" || mode === "changePassword" ? <label>{t.newPassword}<Input type="password" autoComplete="new-password" required minLength={12} value={newPassword} onChange={e => setNewPassword(e.target.value)} /></label> : null}
            {error ? <p className="auth-error" role="alert">{error}</p> : null}
            {feedback ? <p className="auth-success" role="status">{feedback}</p> : null}
            <Button className="auth-submit" type="submit" disabled={busy}>{busy ? "…" : mode === "verify" || mode === "confirmEmailChange" ? t.confirm : mode === "login" ? t.login : mode === "register" ? t.register : t.send}<ArrowRight aria-hidden="true" /></Button>
          </form>
        )}
        {(mode === "login" || mode === "register") ? (
          <div className="auth-google">
            <div className="auth-google-divider"><span>{locale === "pt" ? "ou" : locale === "es" ? "o" : "or"}</span></div>
            <div className="auth-google-slot" ref={googleSlotRef}>
              {googleClientId ? (
                <GoogleOAuthProvider key={locale} clientId={googleClientId} locale={googleLocales[locale]}>
                  <GoogleLogin
                    text="continue_with"
                    theme="outline"
                    size="large"
                    shape="rectangular"
                    logo_alignment="left"
                    width={googleWidth}
                    onSuccess={({ credential }) => credential && void googleSignIn(credential)}
                    onError={() => setError(t.genericError)}
                  />
                </GoogleOAuthProvider>
              ) : (
                <Button type="button" variant="outline" className="auth-google-fallback" disabled title={t.googleUnavailable}>
                  <GoogleMark /><span>{t.continueGoogle}</span>
                </Button>
              )}
            </div>
            {!googleClientId ? <p className="auth-google-unavailable">{t.googleUnavailable}</p> : null}
          </div>
        ) : null}
        <div className="auth-links">
          {mode === "login" ? <><a href="/forgot-password">{t.forgot}</a><span>{t.noAccount} <a href="/register">{t.register}</a></span></> : null}
          {mode === "register" ? <span>{t.alreadyAccount} <a href="/login">{t.login}</a></span> : null}
          {mode !== "login" && mode !== "register" && mode !== "settings" ? <a href="/login">{t.backLogin}</a> : null}
        </div>
      </main>
      </div>
    </div>
  );
}
