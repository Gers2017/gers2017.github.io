import "./BlogPreview.css";

import { type PostMetaData } from "../_types";

interface Props extends PostMetaData {
    url: string;
}

export default function BlogPreview(props: Props) {
    const { title, description, postdate, url, tags } = props;

    return (
        <section class="blog-preview link-parent column gap-small">
            <header>
                <a href={url}>
                    <h2 class="link">{title}</h2>
                </a>
                {
                    <ul class="tags">
                        {tags.map((tag) => (
                            <li class="tag">#{tag}</li>
                        ))}
                    </ul>
                }
            </header>
            <p>{description}</p>
            <footer>
                <a href={url}>
                    <button>Read more</button>
                </a>
                <time>{postdate}</time>
            </footer>
        </section>
    );
}
