export interface Tag {
    id: string;
    name: string;
    slug: string;
    postCount: number;
    createdAt: string;
    updatedAt: string;
    _count?: {
        posts: number;
    };
}

export interface CreateTagRequest {
    name: string;
}

export interface UpdateTagRequest {
    name?: string;
}