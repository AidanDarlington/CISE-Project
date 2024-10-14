import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

@Schema()
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  source: string;

  @Prop({ type: Date })
  publication_year: Date;

  @Prop()
  DOI: string;

  @Prop()
  claim: string;

  @Prop()
  evidence: string;

  @Prop({ type: Date, default: Date.now })
  updated_date: Date;

  @Prop({
    required: true,
    enum: ['pending', 'approved', 'denied'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Boolean, default: false })
  isAnalyzed: boolean;

  @Prop()
  submitterEmail: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
