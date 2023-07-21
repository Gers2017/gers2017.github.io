import { createSignal, type Setter, type Accessor } from "solid-js";
import BlogPreview from "./BlogPreview";
import type { PostMetaData } from "../_types";
import type { MarkdownInstance } from "astro";
import "./Home.css";

type Post = MarkdownInstance<PostMetaData>;
type Posts = Post[];

export default function Home({ posts }: { posts: Posts }) {
    const [state, set_state] = createSignal<string>("");

    return (
        <div>
            <Search set_state={set_state} />
            <ShowPosts state={state} posts={posts} />
        </div>
    );
}

type OnInputEvent = InputEvent & {
    currentTarget: HTMLInputElement;
    target: HTMLInputElement;
};

function Search({ set_state }: { set_state: Setter<string> }) {
    function handle_on_input(event: OnInputEvent) {
        let value = event.target.value.toLowerCase().trim();
        set_state(value);
    }

    return (
        <div class="search-bar">
            <input type="text" placeholder="Search" oninput={handle_on_input} />
        </div>
    );
}

function ShowPosts({
    state,
    posts,
}: {
    state: Accessor<string>;
    posts: Posts;
}) {
    function should_display(post: Post) {
        const keyword = state();
        const name = post.frontmatter.title.toLowerCase();
        const description = post.frontmatter.description.toLowerCase();
        const tags = post.frontmatter.tags.map((tag) => tag.toLowerCase());

        return (
            keyword.length === 0 ||
            name.includes(keyword) ||
            description.includes(keyword) ||
            tags.some((tag) => tag.includes(keyword))
        );
    }

    return (
        <div class="preview-list">
            <ul class="column gap-medium">
                {posts.filter(should_display).map(({ url, frontmatter }) => (
                    <BlogPreview {...frontmatter} url={url ?? "#"} />
                ))}
            </ul>
        </div>
    );
}
