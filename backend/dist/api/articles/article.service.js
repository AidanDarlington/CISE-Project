"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleService = void 0;
const common_1 = require("@nestjs/common");
const article_schema_1 = require("./article.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mail_service_1 = require("./mail.service");
let ArticleService = class ArticleService {
    constructor(articleModel, mailService) {
        this.articleModel = articleModel;
        this.mailService = mailService;
    }
    test() {
        return 'article route testing';
    }
    async findAll() {
        return await this.articleModel.find().exec();
    }
    async findOne(id) {
        return await this.articleModel.findById(id).exec();
    }
    async create(createArticleDto) {
        const newArticle = new this.articleModel({
            ...createArticleDto,
            status: 'pending',
        });
        return await newArticle.save();
    }
    async update(id, createArticleDto) {
        return await this.articleModel
            .findByIdAndUpdate(id, createArticleDto)
            .exec();
    }
    async delete(id) {
        const deletedArticle = await this.articleModel.findByIdAndDelete(id).exec();
        return deletedArticle;
    }
    async approveArticle(id) {
        const article = await this.articleModel
            .findByIdAndUpdate(id, { status: 'approved' }, { new: true })
            .exec();
        if (article && article.submitterEmail) {
            await this.mailService.sendEmail(article.submitterEmail, 'Article Submission Approved', `Your article titled "${article.title}" has been approved.`);
        }
        return article;
    }
    async denyArticle(id) {
        const article = await this.articleModel
            .findByIdAndUpdate(id, { status: 'denied' }, { new: true })
            .exec();
        if (article && article.submitterEmail) {
            await this.mailService.sendEmail(article.submitterEmail, 'Article Submission Denied', `Your article titled "${article.title}" has been denied.`);
        }
        return article;
    }
    async countPendingArticles() {
        return await this.articleModel.countDocuments({ status: 'pending' }).exec();
    }
    async markAsAnalyzed(id) {
        return await this.articleModel
            .findByIdAndUpdate(id, { status: 'analyzed' })
            .exec();
    }
    async findAllRatingSorted(sortOrder) {
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        return await this.articleModel
            .aggregate([
            {
                $addFields: {
                    averageRating: { $avg: '$ratings' },
                },
            },
            {
                $sort: { averageRating: sortDirection },
            },
        ])
            .exec();
    }
    async addRating(id, rating) {
        const article = await this.articleModel.findById(id);
        if (!article) {
            throw new common_1.NotFoundException('Article not found');
        }
        article.ratings.push(rating);
        return article.save();
    }
};
exports.ArticleService = ArticleService;
exports.ArticleService = ArticleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(article_schema_1.Article.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mail_service_1.MailService])
], ArticleService);
//# sourceMappingURL=article.service.js.map