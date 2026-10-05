import '@fontsource-variable/inter';
import '@fontsource-variable/fraunces';
import './globals.css';
import Script from 'next/script';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

const siteUrl = 'https://nameverse.site';
const siteName = 'NameVerse';
const siteLogo = `${siteUrl}/nameverse_logo_emblem.webp`;

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | NameVerse',
    default: 'Baby Names, Meanings, Origins & Lucky Numbers | NameVerse',
  },
  description:
    'Discover 42,000+ baby names with verified meanings, origins, lucky numbers, pronunciation guides, and cultural context across Islamic, Hindu, Christian and Italian traditions.',
  alternates: {
    canonical: siteUrl,
  },
  keywords: [
    'baby names',
    'baby name meanings',
    'name origin',
    'Islamic baby names',
    'Christian baby names',
    'Hindu baby names',
    'Italian baby names',
    'lucky numbers',
    'baby name finder',
  ],
  openGraph: {
    title: 'Baby Names, Meanings, Origins & Lucky Numbers | NameVerse',
    description:
      'Discover 42,000+ baby names with verified meanings, origins, lucky numbers and cultural context across traditions.',
    url: siteUrl,
    siteName: siteName,
    images: [
      {
        url: siteLogo,
        width: 512,
        height: 512,
        alt: 'NameVerse Emblem',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Baby Names, Meanings, Origins & Lucky Numbers | NameVerse',
    description:
      'Discover 42,000+ baby names with verified meanings, origins, lucky numbers and cultural context across traditions.',
    images: [siteLogo],
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  verification: {
    google: 'fB60sPZ-K1f5t10x-57z6f6_n655',
  },
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: siteLogo,
        width: 512,
        height: 512,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'hello@nameverse.site',
        contactType: 'customer support',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: siteName,
      url: siteUrl,
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

const madstearScriptUrl = 'https://revolthem.com/c90e1cf06dc7451f1fd3d33c703af951/invoke.js';
const madstearContainerId = 'container-c90e1cf06dc7451f1fd3d33c703af951';

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#1E3A5F" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{const t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-nv-page text-nv-text antialiased">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1280px] px-3 pt-3 sm:px-4 lg:px-6">
            <div className="flex justify-center overflow-hidden rounded-lg border border-nv-border/60 bg-nv-surface/40 shadow-sm">
              <div id={madstearContainerId} className="w-full max-w-[970px] min-h-[90px] overflow-hidden bg-gradient-to-r from-nv-subtle/60 via-nv-surface to-nv-subtle/60" aria-label="Sponsored advertisement" />
            </div>
          </div>
          {children}
        </main>
        <Footer />
        {/* Fix 9 — load the third-party ad script after hydration so it stays
            off the critical path (LCP / INP). */}
        <Script
          src={madstearScriptUrl}
          strategy="lazyOnload"
          data-cfasync="false"
        />
      </body>
    </html>
  );
}
