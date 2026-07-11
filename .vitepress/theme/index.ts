import { h } from 'vue'
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import Figure from './components/Figure.vue';
import Timeline from './components/Timeline.vue';
import PublicationList from './components/PublicationList.vue';
import TalkList from './components/TalkList.vue';
import PostList from './components/PostList.vue';
import NewsList from './components/NewsList.vue';
import FilterCut from './components/FilterCut.vue';
import PostMeta from './components/PostMeta.vue';
import SiteFooter from './components/SiteFooter.vue';

// Self-hosted fonts: STIX Two Text (display + body, pairs with MathJax math)
// and IBM Plex Mono (nav, metadata, badges, code).
import '@fontsource/stix-two-text/400.css'
import '@fontsource/stix-two-text/400-italic.css'
import '@fontsource/stix-two-text/600.css'
import '@fontsource/stix-two-text/700.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'

import './custom.css'

export default {
    extends: DefaultTheme,
    Layout() {
        return h(DefaultTheme.Layout, null, {
            // Date + reading time above blog post titles.
            'doc-before': () => h(PostMeta),
            'layout-bottom': () => h(SiteFooter),
        })
    },
    enhanceApp({ app }) {
        app.component( 'Figure', Figure );
        app.component( 'Timeline', Timeline );
        app.component( 'PublicationList', PublicationList );
        app.component( 'TalkList', TalkList );
        app.component( 'PostList', PostList );
        app.component( 'NewsList', NewsList );
        app.component( 'FilterCut', FilterCut );
    }
} satisfies Theme
