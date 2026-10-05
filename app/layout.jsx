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
    default: 'Baby Names with Meanings, Origins & Lucky Numbers | NameVerse',
  },
  description:
    'Search 13,801 baby names with verified meanings, origins, pronunciation guides, script forms and cultural context across Islamic, Christian, Hindu and Italian traditions.',
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
    'baby name finder',
    'names by meaning',
  ],
  openGraph: {
    title: 'Baby Names with Meanings, Origins & Lucky Numbers | NameVerse',
    description:
      'Search 13,801 baby names with verified meanings, origins, pronunciation and cultural context across four traditions.',
    url: siteUrl,
    siteName,
    images: [
      {
        url: siteLogo,
        width: 512,
        height: 512,
        alt: 'NameVerse',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Baby Names with Meanings, Origins & Lucky Numbers | NameVerse',
    description:
      'Search 13,801 baby names with verified meanings, origins, pronunciation and cultural context.',
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
      publisher: { '@id': `${siteUrl}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

const adScriptUrl = 'https://revolthem.com/c90e1cf06dc7451f1fd3d33c703af951/invoke.js';
const adContainerId = 'container-c90e1cf06dc7451f1fd3d33c703af951';

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#1E2A4A" />
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
        {/* pb-mobile-cta reserves space for the sticky mobile tab bar so it
            never overlaps the footer or the last content block. */}
        <main className="flex-1 pb-mobile-cta">
          {children}
          {/* Single in-flow ad slot, placed after the page content rather than
              above it. The previous layout rendered a 970x90 ad above every
              page's H1, which pushed the primary keyword below the mobile fold
              and hurt LCP. */}
          <div className="container-page pb-10">
            <div className="flex justify-center overflow-hidden rounded-lg border border-nv-border/60 bg-nv-surface/40">
              <div
                id={adContainerId}
                className="min-h-[90px] w-full max-w-[970px] overflow-hidden bg-nv-subtle/40"
                aria-label="Sponsored advertisement"
              />
            </div>
          </div>
        </main>
        <Footer />
        <Script src={adScriptUrl} strategy="lazyOnload" data-cfasync="false" />
      </body>
    </html>
  );
}
