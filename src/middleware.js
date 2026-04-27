import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-in(.*)",
    "/sign-up",
    "/sign-up(.*)",
    "/details",
    "/api/ai-chat",
  ],
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};