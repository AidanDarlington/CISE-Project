import { Date } from 'mongoose';

export class CreateArticleDto {
  _id?: string;
  title?: string;
  author?: string;
  source?: string;
  publication_year?: Date;
  DOI?: string;
  submittterEmail?: string;
  claim?: string;
  evidence?: string;
}
