<template>
  <footer class="site-footer">
    <p>
      © {{ new Date().getFullYear() }} Syver Døving Agdestein
      <span class="site-footer-sep">·</span>
      <a href="/feed.xml">rss</a>
      <span class="site-footer-sep">·</span>
      <a href="https://github.com/agdestein/agdestein.github.io" target="_blank" rel="noopener noreferrer">source</a>
    </p>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--vp-c-divider);
  padding: 1.5rem 1.5rem 2rem;
  text-align: center;
}

.site-footer p {
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  margin: 0;
}

.site-footer a {
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.site-footer a:hover {
  color: var(--vp-c-brand-1);
}

.site-footer-sep {
  margin: 0 0.5rem;
}
</style>
