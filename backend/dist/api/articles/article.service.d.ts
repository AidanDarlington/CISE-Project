import { Article } from './article.schema';
import { Model } from 'mongoose';
import { CreateArticleDto } from './create-article.dto';
import { MailService } from './mail.service';
export declare class ArticleService {
    private articleModel;
    private readonly mailService;
    constructor(articleModel: Model<Article>, mailService: MailService);
    test(): string;
    findAll(): Promise<Article[]>;
    findOne(id: string): Promise<Article>;
    create(createArticleDto: CreateArticleDto): Promise<import("mongoose").Document<unknown, {}, Article> & Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    update(id: string, createArticleDto: CreateArticleDto): Promise<import("mongoose").Document<unknown, {}, Article> & Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    delete(id: string): Promise<import("mongoose").Document<unknown, {}, Article> & Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    approveArticle(id: string): Promise<import("mongoose").Document<unknown, {}, Article> & Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    denyArticle(id: string): Promise<import("mongoose").Document<unknown, {}, Article> & Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    countPendingArticles(): Promise<number>;
    markAsAnalyzed(id: string): Promise<import("mongoose").Document<unknown, {}, Article> & Article & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
}
