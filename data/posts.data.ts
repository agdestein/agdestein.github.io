import { createContentLoader } from 'vitepress'

// Skip redirect stubs (old date-only URLs pointing at the slugged ones).
export default createContentLoader('/posts/20*.md', {
  transform: (posts) => posts.filter((post) => !post.frontmatter.redirectTo),
})
