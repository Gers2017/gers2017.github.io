import { defineConfig } from "astro/config";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
    site: "https://gers2017.github.io",
    markdown: {
        shikiConfig: {
            theme: "github-dark-dimmed",
        },
    },
    integrations: [solidJs()],
});
