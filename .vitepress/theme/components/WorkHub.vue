<template>
  <div v-if="work" class="work-hub">
    <p class="work-eyebrow">Research project</p>
    <div class="work-head">
      <h1 class="work-title">{{ work.title }}</h1>
      <img :src="work.image" :alt="work.title" class="work-image" />
    </div>
    <p class="work-summary">{{ work.summary }}</p>

    <template v-if="pubCount > 0">
      <h2>{{ pubCount === 1 ? 'Paper' : 'Papers' }}</h2>
      <PublicationList :work="id" />
    </template>

    <template v-if="postCount > 0">
      <h2>{{ postCount === 1 ? 'Interactive explainer' : 'Interactive explainers' }}</h2>
      <PostList :work="id" />
    </template>

    <template v-if="talkCount > 0">
      <h2>{{ talkCount === 1 ? 'Talk' : 'Talks' }}</h2>
      <TalkList :work="id" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { works, type WorkId } from '../../../data/works'
import { publications } from '../../../data/publications'
import { talks } from '../../../data/talks'
import { data as posts } from '../../../data/posts.data'
import PublicationList from './PublicationList.vue'
import TalkList from './TalkList.vue'
import PostList from './PostList.vue'

const { params } = useData()

const id = computed(() => params.value?.id as WorkId)
const work = computed(() => works[id.value])

const pubCount = computed(
  () => publications.filter((p) => p.work === id.value).length
)
const talkCount = computed(() => talks.filter((t) => t.work === id.value).length)
const postCount = computed(
  () => posts.filter((p) => p.frontmatter.work === id.value).length
)
</script>

<style scoped>
.work-eyebrow {
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  margin: 0 0 0.5rem;
}

.work-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
}

.work-image {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  margin-top: 0.5rem;
}

.work-summary {
  font-size: 1.05rem;
}
</style>
