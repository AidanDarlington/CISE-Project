import { Injectable } from '@nestjs/common';
import { Article } from './article.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateArticleDto } from './create-article.dto';

@Injectable()
export class ArticleService {
  constructor(@InjectModel(Article.name) private articleModel: Model<Article>) {}

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
    const newArticle = new this.articleModel({ ...createArticleDto, status: 'pending' });
    return await newArticle.save();
  }

  async update(id: string, createArticleDto: CreateArticleDto) {
    return await this.articleModel.findByIdAndUpdate(id, createArticleDto).exec();
  }

  async delete(id: string) {
    const deletedArticle = await this.articleModel.findByIdAndDelete(id).exec();
    return deletedArticle;
  }

  async approveArticle(id: string) {
    return await this.articleModel.findByIdAndUpdate(id, { status: 'approved' }).exec();
  }

  async denyArticle(id: string) {
    return await this.articleModel.findByIdAndUpdate(id, { status: 'denied' }).exec();
  }

  async countPendingArticles(): Promise<number> {
    return await this.articleModel.countDocuments({ status: 'pending' }).exec();
  }
}