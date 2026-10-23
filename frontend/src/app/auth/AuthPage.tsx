"use client";

import { useCopy } from "@/i18n/useCopy";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { ArrowRight, KeyRound, LogOut, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/common/Navbar";
import type { Locale } from "./locale";
import { localeTags, useLocale } from "./locale";

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
    <svg aria-hidden="true" width="19" height="19" viewBox="0 0 48 48" className="size-[19px]">
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
  const t = useCopy("Auth");

  useEffect(() => {
    if (mode !== "settings" && mode !== "changePassword" && mode !== "changeEmail") return;
    fetch("/api/v1/auth/me", { credentials: "same-origin" }).then(async (response) => {
      if (!response.ok) { window.location.assign("/login"); return; }
      setProfile(await response.json());
    }).catch(() => setError(t.genericError));
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
  const story = useCopy("AuthStory");
  const fieldInput = "min-h-[47px] rounded-[11px] border-[#d9d0e4] bg-white px-[13px] py-[10px] text-[15px] text-brand-ink focus-visible:border-[#7141af] focus-visible:ring-[3px] focus-visible:ring-[#7141af]/15";
  const settingsLink = "flex min-h-[55px] items-center gap-3 rounded-[12px] border border-[#e8ddf3] bg-[#f8f5fc] px-[14px] py-3 font-extrabold text-brand-plum no-underline transition-colors hover:border-[#cbb6e4] hover:bg-[#f0e8fa] [&_svg]:size-[19px] [&_svg]:stroke-[1.8] [&_svg:last-child]:ml-auto [&_svg:last-child]:size-4";

  return (
    <div className="min-h-svh bg-brand-ink bg-[radial-gradient(circle_at_83%_14%,rgba(159,101,232,.6),transparent_34%),radial-gradient(circle_at_5%_88%,rgba(61,106,78,.42),transparent_38%),linear-gradient(125deg,#183a38,#292748_48%,#391b6a)]">
      <Navbar />
      <div className="mx-auto grid min-h-[calc(100svh_-_77px)] w-[min(1130px,calc(100%_-_48px))] grid-cols-[minmax(0,1fr)_minmax(390px,480px)] items-center gap-[clamp(35px,6vw,96px)] pt-[62px] pb-[90px] max-[800px]:block max-[800px]:min-h-[calc(100svh_-_70px)] max-[800px]:w-[min(100%_-_32px,520px)] max-[800px]:pt-[34px] max-[800px]:pb-[65px] max-[420px]:w-[min(100%_-_24px,520px)] max-[420px]:pt-[22px]">
        <aside className="max-w-[510px] text-white max-[800px]:hidden">
          <span className="mb-[26px] grid size-[60px] place-items-center rounded-[18px] border border-white/30 bg-white/10"><Sparkles aria-hidden="true" className="size-[29px] stroke-[1.6] text-brand-leaf" /></span>
          <p className="mt-0 mb-[14px] text-[11px] font-black tracking-[.19em] text-brand-leaf">{story.eyebrow}</p>
          <h2 className="mt-0 mb-[22px] text-[clamp(42px,4.6vw,68px)] font-black leading-[1.04] tracking-[-.05em]">{story.title}</h2>
          <p className="m-0 max-w-[480px] text-[17px] leading-[1.7] text-[#eee9f3]">{story.body}</p>
          <div className="mt-[38px] inline-flex items-center gap-[9px] rounded-[12px] border border-white/20 bg-white/[.08] px-[15px] py-3 text-[12px] font-bold text-[#f3f1f8]"><ShieldCheck aria-hidden="true" className="size-[19px] shrink-0 text-brand-leaf" />{story.note}</div>
        </aside>
        <main className="relative min-h-[430px] w-full overflow-hidden rounded-[25px] border border-white/70 bg-white/[.98] p-[clamp(30px,3vw,43px)] shadow-[0_30px_75px_rgba(17,8,38,.3),0_4px_18px_rgba(17,8,38,.08)] before:absolute before:inset-x-0 before:top-0 before:h-[5px] before:bg-[linear-gradient(90deg,#9f63e0,#d4efa6)] max-[800px]:min-h-0 max-[800px]:px-[26px] max-[800px]:py-[30px] max-[420px]:rounded-[19px] max-[420px]:px-[21px] max-[420px]:py-[28px]">
          <span className="inline-flex items-center gap-[6px] text-[11px] font-black tracking-[.13em] text-[#7141af]"><Sparkles aria-hidden="true" className="size-4" /> MYCELIUM / CONTA</span>
          <h1 className="mt-3 mb-[27px] text-[clamp(30px,4vw,39px)] font-black leading-[1.1] tracking-[-.035em]">{heading}</h1>
          {mode === "checkEmail" ? <p className="leading-[1.6] text-brand-muted">{t.checkEmail}</p> : null}
          {mode === "settings" ? (
            <>
              <p className="leading-[1.6] text-brand-muted">{t.accountIntro}</p>
              {profile ? <p className="[overflow-wrap:anywhere] rounded-[12px] bg-[#f5f0fb] p-[15px] font-extrabold text-brand-plum">{profile.displayName} · {profile.email}</p> : null}
              <div className="my-[25px] grid gap-[10px]"><a href="/settings/change-password" className={settingsLink}><KeyRound aria-hidden="true" />{t.changePassword}<ArrowRight aria-hidden="true" /></a><a href="/settings/change-email" className={settingsLink}><Mail aria-hidden="true" />{t.changeEmail}<ArrowRight aria-hidden="true" /></a></div>
              <Button type="button" variant="outline" className="min-h-[42px] cursor-pointer rounded-[10px] border-[#b9a5cf] bg-white font-extrabold text-brand-plum" onClick={async () => { await request("logout", {}, locale); window.location.assign("/"); }}><LogOut aria-hidden="true" />{t.logout}</Button>
            </>
          ) : (
            <form onSubmit={submit} className="grid gap-[17px]">
              {mode === "register" ? <label className="grid gap-2 text-[13px] font-extrabold text-[#342545]">{t.name}<Input className={fieldInput} autoComplete="name" required minLength={2} maxLength={120} value={name} onChange={e => setName(e.target.value)} /></label> : null}
              {mode === "login" || mode === "register" || mode === "forgot" || mode === "checkEmail" ? <label className="grid gap-2 text-[13px] font-extrabold text-[#342545]">{t.email}<Input className={fieldInput} type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label> : null}
              {mode === "changeEmail" ? <label className="grid gap-2 text-[13px] font-extrabold text-[#342545]">{t.newEmail}<Input className={fieldInput} type="email" autoComplete="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)} /></label> : null}
              {mode === "login" || mode === "register" || mode === "changePassword" ? <label className="grid gap-2 text-[13px] font-extrabold text-[#342545]">{mode === "changePassword" ? t.currentPassword : t.password}<Input className={fieldInput} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={mode === "login" ? 1 : 12} value={password} onChange={e => setPassword(e.target.value)} /></label> : null}
              {mode === "reset" || mode === "changePassword" ? <label className="grid gap-2 text-[13px] font-extrabold text-[#342545]">{t.newPassword}<Input className={fieldInput} type="password" autoComplete="new-password" required minLength={12} value={newPassword} onChange={e => setNewPassword(e.target.value)} /></label> : null}
              {error ? <p className="rounded-[10px] bg-[#ffe8e7] px-[13px] py-[11px] text-[13px] leading-[1.5] text-[#9a1b18]" role="alert">{error}</p> : null}
              {feedback ? <p className="rounded-[10px] bg-[#e9f5dc] px-[13px] py-[11px] text-[13px] leading-[1.5] text-[#28513a]" role="status">{feedback}</p> : null}
              <Button className="mt-[3px] min-h-[48px] w-full cursor-pointer rounded-[11px] border-0 bg-brand-plum text-[14px] font-black text-white hover:bg-[#57258e] disabled:cursor-progress disabled:opacity-55" type="submit" disabled={busy}>{busy ? "…" : mode === "verify" || mode === "confirmEmailChange" ? t.confirm : mode === "login" ? t.login : mode === "register" ? t.register : t.send}<ArrowRight aria-hidden="true" /></Button>
            </form>
          )}
          {(mode === "login" || mode === "register") ? (
            <div className="mt-[25px]">
              <div className="mb-[17px] flex items-center gap-[13px] text-[12px] font-bold uppercase text-[#81738d] before:h-px before:flex-1 before:bg-[#eee7f2] after:h-px after:flex-1 after:bg-[#eee7f2]"><span>{t.separator}</span></div>
              <div className="flex min-h-[42px] w-full items-center justify-center [&>div]:max-w-full" ref={googleSlotRef}>
                {googleClientId ? (
                  <GoogleOAuthProvider key={locale} clientId={googleClientId} locale={googleLocales[locale]}>
                    <GoogleLogin
                      text="continue_with"
                      theme="outline"
                      size="large"
                      shape="rectangular"
                      logo_alignment="center"
                      width={googleWidth}
                      containerProps={{ className: "overflow-hidden rounded-[11px]" }}
                      onSuccess={({ credential }) => credential && void googleSignIn(credential)}
                      onError={() => setError(t.genericError)}
                    />
                  </GoogleOAuthProvider>
                ) : (
                  <Button type="button" variant="outline" className="min-h-[42px] w-full rounded-[11px] border-[#d9d0e4] bg-white text-[14px] font-bold text-[#342545] disabled:opacity-75" disabled title={t.googleUnavailable}>
                    <GoogleMark /><span>{t.continueGoogle}</span>
                  </Button>
                )}
              </div>
              {!googleClientId ? <p className="mt-[9px] mb-0 text-center text-[11px] leading-[1.45] text-[#766b80]">{t.googleUnavailable}</p> : null}
            </div>
          ) : null}
          <div className="mt-[26px] grid gap-[13px] text-[13px] text-[#5f526c]">
            {mode === "login" ? <><a className="font-extrabold text-[#5f2b9c] underline underline-offset-[3px]" href="/forgot-password">{t.forgot}</a><span>{t.noAccount} <a className="font-extrabold text-[#5f2b9c] underline underline-offset-[3px]" href="/register">{t.register}</a></span></> : null}
            {mode === "register" ? <span>{t.alreadyAccount} <a className="font-extrabold text-[#5f2b9c] underline underline-offset-[3px]" href="/login">{t.login}</a></span> : null}
            {mode !== "login" && mode !== "register" && mode !== "settings" ? <a className="font-extrabold text-[#5f2b9c] underline underline-offset-[3px]" href="/login">{t.backLogin}</a> : null}
          </div>
        </main>
      </div>
    </div>
  );
}
