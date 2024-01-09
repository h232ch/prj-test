import {Input} from "@angular/core";

export interface Board {
    id: string;
    user: string;
    email: string;
    title: string;
    content: string;
    published: Date;
    board_images?: File | {
        id: string;
        image: string;
    };
    comments: {
        id: string;
        board: string;
        email: string;
        comment: string;
        published: Date;
        child_comments: {
            id: string,
            user: string,
            email: string,
            comment: string,
            published: Date
            p_comment: string;
        }
    }
}

export interface BoardPagination {
    count: number;
    next: string;
    previous: string;
    results: {
        id: string;
        user: string;
        email: string;
        title: string;
        content: string;
        published: Date;
        board_images?: File | {
            id: string;
            image: string;
        };
        comments: {
            id: string;
            email: string;
            board: string;
            comment: string;
            published: Date;
            child_comments: {
                id: string,
                user: string,
                email: string,
                comment: string,
                published: Date
                p_comment: string;
            }
        }
    }
}

export interface Comment {
    id: number;
    email: string;
    board: number;
    comment: string;
    comment_images?: File | {
        id: string;
        image: string;
    };
    p_comment?: number;
    child_comments: {
        id: string,
        user: string,
        email: string,
        comment: string,
        published: Date
        p_comment: string;
    }
    published: Date;
}

