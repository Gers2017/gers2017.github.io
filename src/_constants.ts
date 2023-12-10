export const BlogMeta = {
    title: "Gers2017 Blog",
    description:
        "Blog about computer science, math, tech and nerd stuff in general",
    author: "Gers2017",
    site_url: "https://gers2017.github.io",
    keywords: "programming,math,blog,github,typescript,rust",
    links: {
        github: "https://github.com/Gers2017",
        mastodon: "https://mastodon.social/@Gers",
    },
};

export function merge_with_title(post_title: string): string {
    return `${post_title} - ${BlogMeta.title}`;
}
