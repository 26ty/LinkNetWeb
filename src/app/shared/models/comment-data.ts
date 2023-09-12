export interface Comment {
    id: string;
    user_id:string;
    article_id:string;
    content:string;
    created_at:string;
    updated_at:string;
}

export interface Collection {
    id: string;
    user_id:string;
    article_id:string;
    created_at:string;
}