export type Article = {
  _id?: string;
  title?: string;
  author?: string;
  source?: string;
  publication_year?: Date;
  DOI?: string;
  submitterEmail?: string;
  claim?: string;
  evidence?: string;
  status?: 'pending' | 'approved' | 'denied' | 'analyzed';
};

export const DefaultEmptyArticle: Article = {
  _id: undefined,
  title: '',
  author: '',
  source: '',
  publication_year: undefined,
  DOI: '',
  submitterEmail: '',
  claim: '',
  evidence: '',
  status: 'pending',
};