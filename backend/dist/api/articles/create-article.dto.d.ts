import { Date } from 'mongoose';
export declare class CreateArticleDto {
    _id?: string;
    title?: string;
    author?: string;
    source?: string;
    publication_year?: Date;
    DOI?: string;
    claim?: string;
    evidence?: string;
}
