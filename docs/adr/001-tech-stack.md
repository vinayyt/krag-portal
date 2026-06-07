# ADR 001 — Technology Stack

**Date:** 2025-01-15
**Status:** Accepted

## Context

Krag Gruppen needs a production-quality homeowner portal that is mobile-first, bilingual (nb/en), supports three brand themes, and can be handed off to an internal dev team for maintenance.

## Decision

We adopt the following stack:

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14 (App Router) | ISR + RSC reduce latency; nested layouts map naturally to the funnel → dashboard split |
| Language | TypeScript (strict) | Catches prop/type drift early; required for safe Prisma schema consumption |
| Styling | Tailwind CSS + CSS custom properties | Tailwind utility classes; theme switching (`data-brand`) via CSS vars avoids JS-in-CSS overhead |
| i18n | next-intl | First-class App Router support; typed `useTranslations`; no runtime hydration mismatch |
| Forms | React Hook Form + Zod | Minimal re-renders; schema-first validation shared between client and API |
| Data fetching | TanStack Query (React Query) | Stale-while-revalidate, optimistic updates for the message composer and choices saving |
| ORM | Prisma + PostgreSQL | Type-safe queries; migration workflow; compatible with Vercel Postgres and Supabase |
| Auth | BankID/Vipps OIDC (Phase 3); email/password fallback | Regulated market requires BankID for document signing; email fallback for development |
| Testing | Vitest + RTL + Playwright + axe-core | Unit tests for pure functions; component tests with RTL; e2e and a11y with Playwright/axe |

## Consequences

- Next.js App Router requires careful boundary placement (`"use client"`) — all interactive components are client components
- Tailwind + CSS vars means theme tokens must be defined in globals.css, not in JS — design tokens live in one place
- Prisma migrations must be run before deploy; `prisma generate` is part of the build script
- BankID integration is mocked in development via email/password; production requires OIDC credentials from Buypass/BankID Norge
