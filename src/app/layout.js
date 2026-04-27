import { Poppins } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";

const poppins = Poppins({ subsets: ["latin"], weight:["500"] });
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const metadata = {
  title: "CureAPT",
  description: "Health Gamified With AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning={true} className={`${poppins.className} antialiased text-foreground`}>
      <ClerkProvider
          publishableKey={publishableKey}
        >
          <Provider>
            <NextThemesProvider 
              attribute="class" 
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              {children}
            </NextThemesProvider>
          </Provider>
        </ClerkProvider>
      </body>
    </html>
  );
}