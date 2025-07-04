interface BlogPostStructuredDataProps {
  title: string
  description: string
  author: string
  datePublished: string
  url: string
  tags: string[]
  imageUrl?: string
}

export function BlogPostStructuredData({
  title,
  description,
  author,
  datePublished,
  url,
  tags,
  imageUrl,
}: BlogPostStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: author,
      url: 'https://0xhabib.tech',
    },
    publisher: {
      '@type': 'Organization',
      name: '0xHabib',
      url: 'https://0xhabib.tech',
    },
    datePublished: datePublished,
    dateModified: datePublished,
    url: url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: tags.join(', '),
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
        width: 1200,
        height: 630,
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

interface WebsiteStructuredDataProps {
  name: string
  description: string
  url: string
}

export function WebsiteStructuredData({ name, description, url }: WebsiteStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: name,
    description: description,
    url: url,
    author: {
      '@type': 'Person',
      name: 'Mohamed Habib Jaouadi',
      url: 'https://0xhabib.tech',
    },
    sameAs: [
      'https://twitter.com/0xhabib',
      'https://github.com/0xhabib',
      'https://linkedin.com/in/0xhabib',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
