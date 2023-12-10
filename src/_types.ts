export interface PostMetaData {
    title: string;
    description: string;
    postdate: string;
    author: string;
    tags: string[];
}

export interface LayoutProps {
    title?: string;
    description?: string;
}

export type BaseHeadProps = Required<LayoutProps>;
