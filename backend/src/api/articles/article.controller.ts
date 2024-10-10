import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './create-article.dto';
import { error } from 'console';

@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/test')
  test() {
    return this.articleService.test();
  }

  // Get all articles
  @Get('/')
  async findAll() {
    try {
      return this.articleService.findAll();
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No Articles found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  // Get one article via id
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    try {
      return this.articleService.findOne(id);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No Article found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  // Create/add an article
  @Post('/')
  async addArticle(@Body() createArticleDto: CreateArticleDto) {
    try {
      await this.articleService.create(createArticleDto);
      return { message: 'Article added successfully' };
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to add this article',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  // Update an article
  @Put('/:id')
  async updateArticle(
    @Param('id') id: string,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    try {
      await this.articleService.update(id, createArticleDto);
      return { message: 'Article updated successfully' };
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to update this article',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  // Delete an article via id
  @Delete('/:id')
  async deleteArticle(@Param('id') id: string) {
    try {
      return await await this.articleService.delete(id);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No such an article',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  // Approve an article
  @Put('/:id/approve')
  async approveArticle(@Param('id') id: string) {
    try {
      await this.articleService.approveArticle(id);
      return { message: 'Article approved successfully' };
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to approve this article',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  // Deny an article
  @Put('/:id/deny')
  async denyArticle(@Param('id') id: string) {
    try {
      await this.articleService.denyArticle(id);
      return { message: 'Article denied successfully' };
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to deny this article',
        },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  @Get('/pending/count')
  async getPendingArticlesCount() {
    try {
      const count = await this.articleService.countPendingArticles();
      return { count };
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Unable to fetch pending articles count',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}