// src/components/common/Meta.tsx
import { Helmet } from 'react-helmet-async';

interface MetaProps {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  image?: string;
}

export const Meta = ({
  title,
  description,
  path,
  type = 'website',
  image = '/og-default.png'  // デフォルトのOG画像
}: MetaProps) => {
  const siteUrl = 'https://niferche.com';
  const fullUrl = `${siteUrl}${path}`;
  const fullTitle = `${title} | Project Niferche`;

  return (
    <Helmet>
      {/* 基本メタデータ */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* OGP */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={`${siteUrl}${image}`} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />
      
      {/* 構造化データ */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': type === 'article' ? 'Article' : 'WebSite',
          name: title,
          description: description,
          url: fullUrl
        })}
      </script>
    </Helmet>
  );
};
