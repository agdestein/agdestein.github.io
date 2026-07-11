import { createContentLoader, type ContentData } from 'vitepress'

export interface PostData extends ContentData {
  readingMinutes: number
}

declare const data: PostData[]
export { data }

// Skip redirect stubs (old date-only URLs pointing at the slugged ones) and
// compute a reading time from the raw source, then drop the source so it is
// not shipped to the client.
export default createContentLoader('/posts/20*.md', {
  includeSrc: true,
  transform: (posts) =>
    posts
      .filter((post) => !post.frontmatter.redirectTo)
      .map((post) => {
        const words = (post.src ?? '').split(/\s+/).length
        return {
          ...post,
          src: undefined,
          readingMinutes: Math.max(1, Math.round(words / 220)),
        }
      }),
})
