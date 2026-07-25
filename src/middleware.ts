import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createIntlMiddleware({
  locales: ["nb", "en"],
  defaultLocale: "nb",
  localePrefix: "always",
});

// Buyer-facing protected routes
const BUYER_ROUTES = /^\/[a-z]{2}\/(dashboard|start|questionnaire|recommendations|meeting)/;
// Builder-only routes
const BUILDER_ROUTES = /^\/[a-z]{2}\/admin/;

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const locale = path.split("/")[1] || "nb";

  const isBuyerRoute = BUYER_ROUTES.test(path);
  const isBuilderRoute = BUILDER_ROUTES.test(path);

  if (isBuyerRoute || isBuilderRoute) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      // Not logged in → send to auth page (preserve locale)
      return NextResponse.redirect(new URL(`/${locale}/auth`, req.url));
    }

    if (isBuilderRoute && token.role !== "BUILDER") {
      // Buyer accidentally hitting /admin → send to dashboard
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
    }

    if (isBuyerRoute && token.role === "BUILDER") {
      // Builder hitting buyer routes → send to admin panel
      return NextResponse.redirect(new URL(`/${locale}/admin`, req.url));
    }
  }

  // Delegate locale routing to next-intl for everything else
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
