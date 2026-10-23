# Mycelium account module

The Java monolith owns users, password hashes, sessions, one-time action tokens,
email delivery and Google ID-token verification. Flyway migrations V5 and V6 add
the required PostgreSQL tables. The frontend never stores the session token in
JavaScript; the backend sends an HTTP-only `myc_session` cookie.

## Required configuration

- Existing PostgreSQL and SMTP environment variables used by `application.yml`.
- `MYCELIUM_FRONTEND_URL`: public origin of the Next frontend, for email links,
  Origin checks and secure cookies. Example: `http://localhost:3000` in development.
- `MYCELIUM_AUTH_FROM`: sender address for account emails. Falls back to
  `EMAIL_AUTHOR` until a Mycelium address is configured.
- `GOOGLE_CLIENT_ID`: OAuth Web client ID for Google ID-token verification. Use
  the same public ID as `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in Next and register the
  frontend origin in Google Cloud.

Accounts are independent of the Diana database. No Diana account records or
secrets are copied. Existing Mycelium commerce endpoints remain available; the
new auth routes are under `/api/v1/auth`.

## Flows

- Register, confirmation email, resend confirmation, login, Google login and logout.
- Forgot/reset password, change password, request/confirm email change.
- Locale preference: `pt`, `en`, `es`; account emails follow the stored locale.
- Database-backed attempt limits and daily cleanup of expired sessions/tokens.

To run the backend locally, start PostgreSQL and configure the existing mail
settings, then use Java 21. A production rollout must apply Flyway migrations
before Next serves registration traffic.
