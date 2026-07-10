<template>
  <div class="news-list">
    <div v-for="item in items" :key="item.type + item.title + item.meta" class="news-entry">
      <img :src="item.image" :alt="item.title" class="news-image" />
      <div class="news-content">
        <component
          :is="item.url ? 'a' : 'div'"
          :href="item.url"
          :target="item.newTab ? '_blank' : undefined"
          :rel="item.newTab ? 'noopener noreferrer' : undefined"
          class="news-title"
        >{{ item.title }}</component>
        <div class="news-meta">
          <span class="news-type" :class="`news-type-${item.type}`">{{ typeLabel(item.type) }}</span>
          {{ item.meta }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { publications } from '../../../data/publications'
import { talks } from '../../../data/talks'
import { data as posts } from '../../../data/posts.data'
import thumbnail from '../utils/thumbnail'
import formatDate from '../utils/formatDate'

const props = defineProps<{
  limit?: number
}>()

interface NewsItem {
  type: 'paper' | 'talk' | 'post'
  title: string
  meta: string
  time: number
  image: string
  url?: string
  // Bypass the VitePress router: needed for anything that is not a page route
  // (external links, and static assets under public/ such as slide decks).
  newTab?: boolean
}

function typeLabel(type: NewsItem['type']): string {
  return { paper: 'publication', talk: 'talk', post: 'blog post' }[type]
}

function parseTime(date: string | undefined, fallback = 0): number {
  if (!date) return fallback
  const t = new Date(date).getTime()
  return isNaN(t) ? fallback : t
}

const items = computed<NewsItem[]>(() => {
  const pubItems = publications.map((p) => {
    const url = p.badges?.find((b) => b.emphasized)?.url ?? p.badges?.[0]?.url
    return {
      type: 'paper' as const,
      title: p.title,
      meta: `${p.venue} · ${p.year}`,
      time: parseTime(p.date, parseTime(`${p.year}-01-01`)),
      image: thumbnail(p.image, p.work, 'publications'),
      url,
      newTab: !!url && !url.startsWith('/'),
    }
  })
  const talkItems = talks.map((t) => ({
    type: 'talk' as const,
    title: t.title,
    meta: `${t.venue} · ${t.date}`,
    time: parseTime(t.date),
    image: thumbnail(t.image, t.work, 'talks'),
    url: t.slidesUrl ?? t.webpageUrl ?? t.abstractUrl,
    // Matches TalkList: slides (a public/ asset) and conference links both
    // open in a new tab.
    newTab: true,
  }))
  const postItems = posts.map((p) => ({
    type: 'post' as const,
    title: p.frontmatter.title,
    meta: formatDate(p.frontmatter.date),
    time: parseTime(p.frontmatter.date),
    image: thumbnail(p.frontmatter.image, p.frontmatter.work, 'posts'),
    url: p.url,
    newTab: false,
  }))
  return [...pubItems, ...talkItems, ...postItems]
    .sort((a, b) => b.time - a.time)
    .slice(0, props.limit ?? 5)
})
</script>

<style scoped>
.news-list {
  margin: 1rem 0;
}

.news-entry {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.news-entry:last-child {
  border-bottom: none;
}

.news-image {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
  align-self: flex-start;
}

.news-content {
  flex: 1;
  min-width: 0;
}

.news-title {
  display: block;
  font-weight: 600;
  line-height: 1.4;
  text-decoration: none;
  color: var(--vp-c-text-1);
}

a.news-title:hover {
  color: var(--vp-c-brand-1);
}

.news-meta {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  margin-top: 0.25rem;
}

.news-type {
  display: inline-block;
  padding: 0 0.5rem;
  margin-right: 0.375rem;
  border-radius: 999px;
  font-size: 0.8em;
  font-weight: 500;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
</style>
