import { getAllPosts } from '@/lib/posts'
import { getCanonicalUrl } from '@/lib/url'

export async function GET() {
  const posts = await getAllPosts()
  
  // Filter out draft posts for RSS feed
  const publishedPosts = posts.filter(post => post.visibility === 'public')
  
  const rssItems = publishedPosts
    .slice(0, 20) // Latest 20 posts
    .map((post) => {
      const postDate = new Date(`${post.date}T00:00:00Z`)
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${getCanonicalUrl(`/posts/${post.slug}`)}</link>
      <guid isPermaLink="true">${getCanonicalUrl(`/posts/${post.slug}`)}</guid>
      <pubDate>${postDate.toUTCString()}</pubDate>
      <author>mjawady31@gmail.com (${post.author})</author>
      ${post.tags.map(tag => `<category>${tag}</category>`).join('')}
    </item>`
    }).join('')

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>0xHabib - Mohamed Habib Jaouadi</title>
    <description>Engineering insights, system design, and technical deep dives by Mohamed Habib Jaouadi</description>
    <link>${getCanonicalUrl('')}</link>
    <atom:link href="${getCanonicalUrl('/feed.xml')}" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <managingEditor>mjawady31@gmail.com (Mohamed Habib Jaouadi)</managingEditor>
    <webMaster>mjawady31@gmail.com (Mohamed Habib Jaouadi)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>60</ttl>
    <image>
      <url>${getCanonicalUrl('/favicon.ico')}</url>
      <title>0xHabib</title>
      <link>${getCanonicalUrl('')}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
    },
  })
}
