import { Injectable } from '@nestjs/common';
import { Article } from './article.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateArticleDto } from './create-article.dto';
import { MailService } from './mail.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    private readonly mailService: MailService,
  ) {}

  test(): string {
    return 'article route testing';
  }

  async findAll(): Promise<Article[]> {
    return await this.articleModel.find().exec();
  }

  async findOne(id: string): Promise<Article> {
    return await this.articleModel.findById(id).exec();
  }

  async create(createArticleDto: CreateArticleDto) {
    const newArticle = new this.articleModel({
      ...createArticleDto,
      status: 'pending',
    });
    return await newArticle.save();
  }

  async update(id: string, createArticleDto: CreateArticleDto) {
    return await this.articleModel
      .findByIdAndUpdate(id, createArticleDto)
      .exec();
  }

  async delete(id: string) {
    const deletedArticle = await this.articleModel.findByIdAndDelete(id).exec();
    return deletedArticle;
  }

  async approveArticle(id: string) {
    const article = await this.articleModel
      .findByIdAndUpdate(id, { status: 'approved' }, { new: true })
      .exec();

    if (article && article.submitterEmail) {
      await this.mailService.sendEmail(
        article.submitterEmail,
        'Article Submission Approved',
        `Your article titled "${article.title}" has been approved.`,
      );
    }

    return article;
  }

  async denyArticle(id: string) {
    const article = await this.articleModel
      .findByIdAndUpdate(id, { status: 'denied' }, { new: true })
      .exec();

    if (article && article.submitterEmail) {
      await this.mailService.sendEmail(
        article.submitterEmail,
        'Article Submission Denied',
        `Your article titled "${article.title}" has been denied.`,
      );
    }

    return article;
  }

  async countPendingArticles(): Promise<number> {
    return await this.articleModel.countDocuments({ status: 'pending' }).exec();
  }

  async markAsAnalyzed(id: string) {
    return await this.articleModel
      .findByIdAndUpdate(id, { status: 'analyzed' })
      .exec();
  }
}
