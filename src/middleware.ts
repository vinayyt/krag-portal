import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["nb", "en"],
  defaultLocale: "nb",
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
