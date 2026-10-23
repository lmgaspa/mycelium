export type Locale = "pt" | "en" | "es";

export const localeTags: Record<Locale, string> = { pt: "pt-BR", en: "en-US", es: "es-ES" };

export function readLocale(): Locale {
  if (typeof document === "undefined") return "pt";
  const value = document.cookie.match(/(?:^|; )myc_locale=(pt|en|es)(?:;|$)/)?.[1];
  if (value === "pt" || value === "en" || value === "es") return value;
  const browser = navigator.language.slice(0, 2);
  return browser === "en" || browser === "es" ? browser : "pt";
}

export function saveLocale(locale: Locale) {
  document.cookie = `myc_locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  document.documentElement.lang = localeTags[locale];
  window.dispatchEvent(new CustomEvent("myc-locale-change", { detail: locale }));
}

export function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>("pt");
  useEffect(() => {
    setLocale(readLocale());
    const listener = (event: Event) => setLocale((event as CustomEvent<Locale>).detail);
    window.addEventListener("myc-locale-change", listener);
    return () => window.removeEventListener("myc-locale-change", listener);
  }, []);
  return locale;
}

export const messages = {
  pt: {
    login: "Entrar", register: "Criar conta", forgot: "Esqueceu sua senha?", reset: "Redefinir senha",
    verify: "Confirmar e-mail", changePassword: "Mudar senha", changeEmail: "Mudar e-mail",
    confirmEmailChange: "Confirmar novo e-mail", settings: "Minha conta", email: "E-mail", name: "Nome",
    password: "Senha", newPassword: "Nova senha", currentPassword: "Senha atual", newEmail: "Novo e-mail",
    continueGoogle: "Continuar com Google", send: "Enviar", backLogin: "Voltar para entrar",
    alreadyAccount: "Já tem uma conta?", noAccount: "Ainda não tem conta?", genericError: "Não foi possível concluir. Tente novamente.",
    invalidLogin: "E-mail ou senha inválidos.", checkEmail: "Confira seu e-mail para continuar.",
    resetSent: "Se a conta existir, enviaremos um link para redefinir a senha.",
    changed: "Alteração concluída. Entre novamente.", verified: "E-mail confirmado. Você já pode entrar.", confirm: "Confirmar", logout: "Sair",
    accountIntro: "Gerencie os dados e a segurança da sua conta Mycelium.",
    googleUnavailable: "Login com Google disponível após configurar o Client ID.",
  },
  en: {
    login: "Sign in", register: "Create account", forgot: "Forgot your password?", reset: "Reset password",
    verify: "Confirm email", changePassword: "Change password", changeEmail: "Change email",
    confirmEmailChange: "Confirm new email", settings: "My account", email: "Email", name: "Name",
    password: "Password", newPassword: "New password", currentPassword: "Current password", newEmail: "New email",
    continueGoogle: "Continue with Google", send: "Send", backLogin: "Back to sign in",
    alreadyAccount: "Already have an account?", noAccount: "Don't have an account?", genericError: "Could not complete the request. Please try again.",
    invalidLogin: "Invalid email or password.", checkEmail: "Check your email to continue.",
    resetSent: "If the account exists, we'll send a password reset link.",
    changed: "Change complete. Sign in again.", verified: "Email confirmed. You can sign in now.", confirm: "Confirm", logout: "Sign out",
    accountIntro: "Manage your Mycelium account details and security.",
    googleUnavailable: "Google sign in will be available once the Client ID is configured.",
  },
  es: {
    login: "Entrar", register: "Crear cuenta", forgot: "¿Olvidaste tu contraseña?", reset: "Restablecer contraseña",
    verify: "Confirmar correo", changePassword: "Cambiar contraseña", changeEmail: "Cambiar correo",
    confirmEmailChange: "Confirmar nuevo correo", settings: "Mi cuenta", email: "Correo", name: "Nombre",
    password: "Contraseña", newPassword: "Nueva contraseña", currentPassword: "Contraseña actual", newEmail: "Nuevo correo",
    continueGoogle: "Continuar con Google", send: "Enviar", backLogin: "Volver a entrar",
    alreadyAccount: "¿Ya tienes cuenta?", noAccount: "¿Aún no tienes cuenta?", genericError: "No se pudo completar. Inténtalo de nuevo.",
    invalidLogin: "Correo o contraseña inválidos.", checkEmail: "Revisa tu correo para continuar.",
    resetSent: "Si la cuenta existe, enviaremos un enlace para restablecer la contraseña.",
    changed: "Cambio completado. Inicia sesión de nuevo.", verified: "Correo confirmado. Ya puedes iniciar sesión.", confirm: "Confirmar", logout: "Salir",
    accountIntro: "Administra los datos y la seguridad de tu cuenta Mycelium.",
    googleUnavailable: "Google estará disponible cuando se configure el Client ID.",
  },
} as const;
import { useEffect, useState } from "react";

