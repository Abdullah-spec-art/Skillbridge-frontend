import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
}

export default function SEO({ title, description }: SEOProps) {
  return (
    <Helmet>
      <title>{title} | SkillBridge AI</title>
      <meta name="description" content={description} />
      
      <meta property="og:title" content={`${title} | SkillBridge AI`} />
      <meta property="og:description" content={description} />
    </Helmet>
  );
}