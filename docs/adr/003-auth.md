# ADR 003 — Authentication & Identity

**Date:** 2025-01-15
**Status:** Accepted (BankID/Vipps deferred to Phase 3)

## Context

Norwegian home buyers expect BankID as the primary identity method — it is the national e-ID standard. Contracts requiring legal signature must be bound to a verified identity. The development environment needs a simpler fallback.

## Decision

### Phase 1–2 (development / staging)
- Email + password authentication with bcrypt-hashed passwords
- Session stored in a signed HTTP-only cookie (`krag-session`)
- No personal ID verification at login — stub only

### Phase 3 (production)
- **BankID OIDC** via Buypass ID or BankID Norge
  - Standard OIDC flow (`authorization_code` + PKCE)
  - Scopes: `openid profile nin` (national identity number for contract binding)
  - `sub` claim stored as `User.bankIdSub`
- **Vipps Login** as secondary option
  - OAuth 2.0 + OIDC via Vipps MobilePay API
  - `sub` stored as `User.vippsSub`
- Email/password remains available for internal test accounts

### Document signing (e-sign)
- E-sign is separate from login auth
- Recommended provider: Scrive or Signicat (both support BankID signing)
- Documents requiring signature (`KragDocument.signed === false`) are sent to e-sign provider
- Signed callback updates `Document.signed = true` and `Document.fileUrl`

### Session management
- Sessions expire after 30 days
- Refresh via sliding window on activity
- `Session` records are purged nightly via a cron job

## Consequences

- BankID integration requires a production contract with Buypass/BankID Norge (~2–4 week onboarding)
- `nin` (personnummer) is sensitive PII — must not be logged or stored beyond session; only the `sub` identifier is persisted
- Development email/password must be clearly flagged in the UI ("Demo login") and disabled in production via `ALLOW_PASSWORD_AUTH=false` env flag
