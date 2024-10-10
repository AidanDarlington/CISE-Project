import { Date, HydratedDocument } from 'mongoose';
export type ArticleDocument = HydratedDocument<Article>;
export declare class Article {
    title: string;
    author: string;
    source: string;
    publication_year: Date;
    DOI: string;
    claim: string;
    evidence: string;
    updated_date: Date;
    status: string;
}
export declare const ArticleSchema: import("mongoose").Schema<Article, import("mongoose").Model<Article, any, any, any, import("mongoose").Document<unknown, any, Article> & Article & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Article, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Article>> & import("mongoose").FlatRecord<Article> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>;
