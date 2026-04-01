import { fetchPageSeo } from '../lib/wordpress-blog';

export default async function PageSchemas({ slug, type = 'page' }: { slug: string; type?: 'page' | 'product' }) {
  const seo = await fetchPageSeo(slug, type);
  if (!seo?.schemas?.length) return null;
  return (
    <>
      {seo.schemas.map((schema: string, i: number) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema }}
        />
      ))}
    </>
  );
}
