import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.darksgym.com.br";
const SITE_NAME = "DARK'SGYM";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

interface SEOProps {
  /** Título da página. Se omitido, usa o padrão da home. */
  title?: string;
  /** Descrição (≤ 160 caracteres ideal). */
  description?: string;
  /** Imagem para preview (Open Graph + Twitter). URL absoluta. */
  imageUrl?: string;
  /** Caminho relativo (ex.: "/trabalhe-conosco"). Será concatenado ao SITE_URL. */
  path?: string;
  /** Se true, instrui buscadores a NÃO indexar a página (útil para /admin). */
  noindex?: boolean;
  /** Tipo Open Graph (default: website). Use "article" em posts. */
  type?: "website" | "article" | "profile";
}

const SEO: React.FC<SEOProps> = ({
  title,
  description = "DARK'SGYM: rede de academias 24h com equipamentos de elite em Santo André, Mauá e Ribeirão Pires. Musculação, lutas, spinning e mais. Encontre a unidade mais próxima.",
  imageUrl = DEFAULT_IMAGE,
  path = "/",
  noindex = false,
  type = "website",
}) => {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Academia 24h em Santo André, Mauá e Ribeirão Pires`;
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      {/* Tags Padrão */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE_NAME} — ${title || "Academia 24h"}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta
        name="twitter:image:alt"
        content={`${SITE_NAME} — ${title || "Academia 24h"}`}
      />
    </Helmet>
  );
};

export default SEO;
