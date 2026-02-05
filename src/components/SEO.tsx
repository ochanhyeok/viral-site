import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  type?: 'website' | 'article';
  structuredData?: object;
}

const BASE_URL = 'https://viral-site-opal.vercel.app';

export function SEO({
  title,
  description,
  keywords,
  ogImage,
  type = 'website',
  structuredData
}: SEOProps) {
  const location = useLocation();
  const siteTitle = '직장인 꿀툴 모음';
  const fullTitle = title === '홈' ? siteTitle : `${title} | ${siteTitle}`;
  const defaultOgImage = `${BASE_URL}/og-image.png`;
  const canonicalUrl = `${BASE_URL}${location.pathname}`;
  const imageUrl = ogImage ? `${BASE_URL}${ogImage}` : defaultOgImage;

  // 기본 구조화 데이터
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: fullTitle,
    description: description,
    url: canonicalUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: siteTitle,
      url: BASE_URL
    }
  };

  const jsonLd = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* 기본 메타 태그 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="ko_KR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* 구조화 데이터 */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
}
