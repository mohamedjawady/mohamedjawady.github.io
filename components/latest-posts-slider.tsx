import { getPublicPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { Carousel } from "@/components/ui/carousel";

export async function LatestPostsSlider({ excludeSlug }: { excludeSlug?: string }) {
  const posts = (await getPublicPosts()).filter(p => p.slug !== excludeSlug).slice(0, 10);
  if (!posts.length) return null;

  return (
    <section className="mx-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 px-4 md:px-0">Read Also</h2>
      <Carousel opts={{ align: "start" }}>
        <div
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide py-2 px-2 md:px-0 snap-x snap-mandatory"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {posts.map(post => (
            <div
              key={post.slug}
              className="min-w-[85vw] max-w-[90vw] md:min-w-[320px] md:max-w-xs snap-start flex-shrink-0"
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </Carousel>
    </section>
  );
}
