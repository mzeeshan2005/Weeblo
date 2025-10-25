import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";
import Header from "@/components/Header";
import { AppWrapper } from "../context/page";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";

// Enhanced metadata for better SEO
export const metadata = {
  metadataBase: new URL("https://www.weeblo.vercel.app"),
  title: {
    default: "Weeblo - Watch Anime Online Free | HD Subbed & Dubbed",
    template: "%s | Weeblo"
  },
  description:
    "Watch your favorite anime online in HD quality. Stream subbed and dubbed anime for free with no ads. Enjoy One Piece, Naruto, Attack on Titan, and thousands more anime series.",
  keywords: [
    "watch anime online",
    "anime streaming",
    "free anime",
    "subbed anime",
    "dubbed anime",
    "HD anime",
    "anime online free",
    "one piece",
    "naruto",
    "attack on titan",
    "my hero academia",
    "demon slayer",
    "jujutsu kaisen",
    "anime episodes",
    "latest anime",
    "anime series",
    "watch anime",
    "stream anime",
    "anime website"
  ],
  authors: [{ name: "Weeblo Team" }],
  creator: "Weeblo",
  publisher: "Weeblo",
  applicationName: "Weeblo",
  category: "Entertainment",
  
  // Open Graph metadata
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.weeblo.vercel.app",
    siteName: "Weeblo",
    title: "Weeblo - Watch Anime Online Free | HD Subbed & Dubbed",
    description:
      "Stream your favorite anime series in HD quality. Free, no ads, subbed and dubbed episodes available.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Weeblo - Watch Anime Online",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Weeblo - Watch Anime Online Free",
    description:
      "Stream anime series in HD quality. Free, no ads, subbed and dubbed.",
    images: ["/twitter-image.png"],
    creator: "@weeblo",
  },

  // Robots metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Additional metadata
  alternates: {
    canonical: "https://www.weeblo.vercel.app",
  },
  
  verification: {
    google: "your-google-verification-code", // Add your verification code
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },

  // App Links
  appLinks: {
    web: {
      url: "https://www.weeblo.vercel.app",
      should_fallback: true,
    },
  },

  // Other metadata
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

// Viewport configuration
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#100b25" },
  ],
};

export default async function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Weeblo",
    alternateName: "Weeblo Anime",
    url: "https://www.weeblo.vercel.app",
    description:
      "Watch your favorite anime online in HD quality. Stream subbed and dubbed anime for free.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.weeblo.vercel.app/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Weeblo",
      logo: {
        "@type": "ImageObject",
        url: "https://www.weeblo.vercel.app/logo.png",
      },
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      
      <body 
        className="bg-gray-50 text-black dark:bg-[#100b25] dark:text-white overflow-x-hidden w-screen"
        suppressHydrationWarning
      >
        <AppWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme={false}
          >
            <NextTopLoader
              color="#0283ed"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #2299DD,0 0 5px #2299DD"
            />
            
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded"
            >
              Skip to main content
            </a>
            
            <Header />
            
            <main id="main-content" className="min-h-screen no-scrollbar">
              {children}
            </main>
            
            <Footer />
          </ThemeProvider>
        </AppWrapper>
      </body>
    </html>
  );
}