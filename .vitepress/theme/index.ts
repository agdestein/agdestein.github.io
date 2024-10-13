// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import Figure from './components/Figure.vue';

export default {
    extends: DefaultTheme,
    enhanceApp({ app, router, siteData }) {
        app.component( 'Figure', Figure );
    }
} satisfies Theme
