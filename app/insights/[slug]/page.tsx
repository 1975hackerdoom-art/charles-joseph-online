import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleDetail } from '@/components/CharlesSite';
import { getInsight, insightArticles } from '@/content/insights';

export function generateStaticParams() { return insightArticles.map(({ slug }) => ({ slug })); }

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const article = getInsight(slug);
    return article ? { title: `${article.title} | Charles Joseph`, description: article.preview, alternates: { canonical: `/insights/${article.slug}` } } : {};
  });
}

export default async function InsightArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getInsight(slug)) notFound();
  return <ArticleDetail slug={slug} />;
}
